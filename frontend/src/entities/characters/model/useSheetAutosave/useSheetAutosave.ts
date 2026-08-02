import { useQueryClient } from '@tanstack/vue-query';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
  characterQueries,
  updateCharacterSheet,
  type CharacterDetail,
  type CharacterSheet,
} from '@shared/api/characters';
import { BASE_URL } from '@shared/lib/http';

import type {
  AutosaveTarget,
  BufferedPatch,
  SaveState,
  TargetPatch,
} from './useSheetAutosave.types';

const DEBOUNCE_MS = 2000;
/** Bounds debounce *deferral*, not in-flight duration — see the flush below. */
const MAX_WAIT_MS = 12000;
const MAX_RETRIES = 4;
const RETRY_BASE_MS = 500;
const SAVED_BADGE_MS = 1500;

const bufferKey = (characterId: string): string => {
  return `sheetBuffer:${characterId}`;
};

/**
 * The sheet's autosave controller.
 *
 * A Pinia store rather than a page composable on purpose: it has to outlive the
 * route to flush on leave and to keep retrying after navigation. A composable
 * scoped to CharacterPage would cancel exactly the flush that matters.
 *
 * Invariants it enforces, all of which the sheet depends on:
 * - it is the **only** writer of `character_sheets`; explicit-save forms may
 *   write the `characters` row and nothing else
 * - patches carry **absolute values, never deltas**, so a resend is idempotent
 * - **single-flight per target**: one request in flight at a time, so a slow
 *   older response can never land after a newer one and overwrite it
 */
export const useSheetAutosave = defineStore('sheetAutosave', () => {
  const qc = useQueryClient();

  const characterId = ref<string | null>(null);
  const pending = ref<Partial<Record<AutosaveTarget, TargetPatch>>>({});
  const inFlight = ref<Partial<Record<AutosaveTarget, TargetPatch>>>({});
  const frozen = ref<Set<AutosaveTarget>>(new Set());
  const saveState = ref<SaveState>('idle');

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let maxWaitTimer: ReturnType<typeof setTimeout> | null = null;
  let savedBadgeTimer: ReturnType<typeof setTimeout> | null = null;

  const hasUnsavedChanges = computed(() => {
    return (
      Object.keys(pending.value).length > 0 || Object.keys(inFlight.value).length > 0
    );
  });

  const cachedDetail = (): CharacterDetail | undefined => {
    if (!characterId.value) {
      return;
    }

    return qc.getQueryData<CharacterDetail>(
      characterQueries.character(characterId.value),
    );
  };

  const writeSheetThrough = (sheet: CharacterSheet) => {
    if (!characterId.value) {
      return;
    }

    qc.setQueryData(
      characterQueries.character(characterId.value),
      (old: CharacterDetail | undefined) => {
        return old ? { ...old, sheet } : old;
      },
    );
  };

  const clearBuffer = () => {
    if (!characterId.value) {
      return;
    }

    localStorage.removeItem(bufferKey(characterId.value));
  };

  /**
   * Mirrors the pending copy so a mid-combat refresh or crash does not lose an
   * unsaved hp change. This app is for in-person play on possibly-spotty wifi.
   */
  const writeBuffer = () => {
    const detail = cachedDetail();

    if (!characterId.value || !detail || !pending.value.character) {
      return;
    }

    const buffered: BufferedPatch = {
      characterId: characterId.value,
      baseSeq: detail.sheet.lastWriteSeq,
      patch: pending.value.character,
    };

    localStorage.setItem(bufferKey(characterId.value), JSON.stringify(buffered));
  };

  const clearTimers = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (maxWaitTimer) {
      clearTimeout(maxWaitTimer);
    }

    debounceTimer = null;
    maxWaitTimer = null;
  };

  const sendPatch = (
    id: string,
    target: AutosaveTarget,
    patch: TargetPatch,
  ): Promise<CharacterSheet> => {
    /** One case today; sub-entity targets add their own as wave 2 lands. */
    if (target === 'character') {
      return updateCharacterSheet(id, patch);
    }

    return Promise.reject(new Error(`Unknown autosave target: ${target}`));
  };

  const flushTarget = async (target: AutosaveTarget, attempt = 0) => {
    const id = characterId.value;
    const patch = pending.value[target];

    // Single-flight: a target already in flight is left alone. Whatever is
    // pending is picked up by the follow-up flush when this one settles.
    if (!id || !patch || inFlight.value[target] || frozen.value.has(target)) {
      return;
    }

    inFlight.value = { ...inFlight.value, [target]: patch };

    const { [target]: _sent, ...rest } = pending.value;
    pending.value = rest;
    saveState.value = 'saving';

    try {
      const sheet = await sendPatch(id, target, patch);

      writeSheetThrough(sheet);

      const { [target]: _done, ...stillInFlight } = inFlight.value;
      inFlight.value = stillInFlight;

      // Edited again while in flight — send the newer working copy.
      if (pending.value[target]) {
        await flushTarget(target);

        return;
      }

      saveState.value = 'saved';
      savedBadgeTimer = setTimeout(() => {
        if (saveState.value === 'saved') {
          saveState.value = 'idle';
        }
      }, SAVED_BADGE_MS);
    } catch (error) {
      const { [target]: _failed, ...stillInFlight } = inFlight.value;
      inFlight.value = stillInFlight;

      // Merge the failed fields back *under* anything newer: the retry must
      // re-read the current working copy, never resend a stale payload.
      pending.value = {
        ...pending.value,
        [target]: { ...patch, ...pending.value[target] },
      };

      if (attempt < MAX_RETRIES) {
        setTimeout(
          () => {
            void flushTarget(target, attempt + 1);
          },
          RETRY_BASE_MS * 2 ** attempt,
        );
      }

      saveState.value = 'error';
      throw error;
    }
  };

  const flushAll = async () => {
    clearTimers();

    const targets = Object.keys(pending.value) as AutosaveTarget[];

    await Promise.allSettled(
      targets.map((target) => {
        return flushTarget(target);
      }),
    );
  };

  const scheduleFlush = () => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      void flushAll();
    }, DEBOUNCE_MS);

    // Constant nudging (dragging an hp stepper) must not defer a flush forever.
    if (!maxWaitTimer) {
      maxWaitTimer = setTimeout(() => {
        void flushAll();
      }, MAX_WAIT_MS);
    }
  };

  /**
   * Queue an edit. `immediate` skips the debounce for single-shot edits —
   * conditions, death saves, inspiration — which have no follow-up write to
   * carry them if the tab is backgrounded. Repeated fields (hp, counters) are
   * self-healing because the next tick resends the absolute value.
   */
  const patchSheet = (patch: TargetPatch, immediate = false) => {
    if (!characterId.value) return;

    pending.value = {
      ...pending.value,
      character: { ...pending.value.character, ...patch },
    };
    writeBuffer();

    if (immediate) {
      clearTimers();
      void flushAll();

      return;
    }

    scheduleFlush();
  };

  /**
   * Best-effort save on page teardown: a plain PATCH does not survive it, and
   * `sendBeacon` is POST-only so it cannot hit a PATCH target at all. The
   * localStorage buffer is the real durability net.
   */
  const flushOnTeardown = () => {
    const id = characterId.value;
    const patch = pending.value.character;

    if (!id || !patch) return;

    void fetch(`${BASE_URL}/character/${id}/sheet`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(patch),
      keepalive: true,
    });
  };

  /**
   * Adopt a fetched row, replaying a buffered patch only if it was derived from
   * that exact row. A buffer whose base is older is discarded whole — server
   * wins, no merge, no prompt.
   */
  const attach = (id: string, sheet: CharacterSheet) => {
    if (characterId.value !== id) {
      clearTimers();
      pending.value = {};
      inFlight.value = {};
      frozen.value = new Set();
      saveState.value = 'idle';
    }

    characterId.value = id;

    const raw = localStorage.getItem(bufferKey(id));

    if (!raw) return;

    try {
      const buffered = JSON.parse(raw) as BufferedPatch;

      if (buffered.characterId !== id || buffered.baseSeq !== sheet.lastWriteSeq) {
        localStorage.removeItem(bufferKey(id));

        return;
      }

      pending.value = { character: buffered.patch };
      scheduleFlush();
    } catch {
      localStorage.removeItem(bufferKey(id));
    }
  };

  const detach = () => {
    void flushAll();
  };

  /**
   * The shared choreography for the three atomic actions (rest, level-up,
   * setup): flush pending, freeze the affected targets, POST, adopt the state
   * that comes back, then clear the dirty set and the buffer. None of the three
   * re-implements it, and autosave never fights the reset.
   */
  const runServerAction = async <T extends { sheet: CharacterSheet }>(
    endpoint: string,
    body: unknown,
    targets: AutosaveTarget[] = ['character'],
  ): Promise<T> => {
    const id = characterId.value;

    if (!id) throw new Error('No character attached');

    await flushAll();
    frozen.value = new Set([...frozen.value, ...targets]);

    try {
      const response = await fetch(`${BASE_URL}/character/${id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Action ${endpoint} failed`);

      const adopted = (await response.json()) as T;

      for (const target of targets) {
        const { [target]: _dropped, ...rest } = pending.value;
        pending.value = rest;
      }

      clearBuffer();
      writeSheetThrough(adopted.sheet);
      void qc.invalidateQueries({ queryKey: characterQueries.character(id) });

      return adopted;
    } finally {
      const next = new Set(frozen.value);

      for (const target of targets) {
        next.delete(target);
      }

      frozen.value = next;
    }
  };

  const stopBadgeTimer = () => {
    if (savedBadgeTimer) {
      clearTimeout(savedBadgeTimer);
    }
  };

  return {
    saveState,
    hasUnsavedChanges,
    attach,
    detach,
    patchSheet,
    flushAll,
    flushOnTeardown,
    runServerAction,
    stopBadgeTimer,
  };
});
