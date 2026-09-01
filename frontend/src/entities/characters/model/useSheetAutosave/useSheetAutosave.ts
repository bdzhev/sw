import { useQueryClient } from '@tanstack/vue-query';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import {
  characterQueries,
  runCharacterAction,
  sendSheetPatchOnTeardown,
  type CharacterSheet,
  type SheetPatch,
} from '@shared/api/characters';

import { clearBuffer, takeBufferFor, writeBuffer } from '../sheet-buffer';
import { mergeCachedSheet, readCachedDetail, writeCachedSheet } from '../sheet-cache';
import { useUpdateSheet } from '../useUpdateSheet';
import type { SaveState } from './useSheetAutosave.types';

const DEBOUNCE_MS = 2000;
/** Bounds debounce *deferral*, not in-flight duration - see the flush below. */
const MAX_WAIT_MS = 12000;
const MAX_RETRIES = 4;
const RETRY_BASE_MS = 500;
const SAVED_BADGE_MS = 1500;

/**
 * Trailing window on the localStorage mirror. `setItem` is synchronous and a held
 * stepper queues ~17 edits a second, so mirroring inline put a `JSON.stringify` and
 * a `setItem` on every one of them. What this buys instead is a stateable guarantee:
 * a hard crash loses at most this much, and every *soft* teardown path sends the
 * patch outright anyway.
 */
const BUFFER_WRITE_MS = 250;

/**
 * The sheet's autosave controller.
 *
 * See `README.md` beside this file for how it operates end to end. In short:
 *
 * A Pinia store rather than a page composable on purpose - it has to outlive the
 * route to flush on leave and to keep retrying after navigation. A composable scoped
 * to the sheet would cancel exactly the flush that matters.
 *
 * Invariants it enforces, all of which the sheet depends on:
 * - it is the **only** writer of `character_sheets`; explicit-save forms may write
 *   the `characters` row and nothing else
 * - patches carry **absolute values, never deltas**, so a resend is idempotent
 * - **single-flight**: one request out at a time, so a slow older response can never
 *   land after a newer one and overwrite it
 * - the query cache **is** the working copy - there is no second dirty copy layered
 *   over it, so there is nothing to drift
 */
export const useSheetAutosave = defineStore('sheetAutosave', () => {
  const qc = useQueryClient();
  const { updateSheet } = useUpdateSheet();

  /**
   * The only reactive state. The patches below deliberately are not: nothing outside
   * this store reads them, and holding them in a `ref` deep-proxied every patch
   * object that passed through - seventeen a second while a stepper is held.
   */
  const saveState = ref<SaveState>('idle');
  const isDirty = ref(false);

  let characterId: string | null = null;

  /**
   * `undefined` rather than `null` for the two patch slots, because that is what
   * "absent" means to the spread operator: `{ ...undefined }` is legal and `{ ...null }`
   * is a type error, and both slots are merged by spreading.
   */
  let pendingPatch: SheetPatch | undefined;
  let inFlightPatch: SheetPatch | undefined;
  let isFrozen = false;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let maxWaitTimer: ReturnType<typeof setTimeout> | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let bufferTimer: ReturnType<typeof setTimeout> | null = null;
  let savedBadgeTimer: ReturnType<typeof setTimeout> | null = null;

  const syncDirty = (): void => {
    isDirty.value = Boolean(pendingPatch || inFlightPatch);
  };

  /**
   * The only writer of the pending slot, so the dirty flag cannot fall out of step
   * with it.
   *
   * It also keeps the slot readable after an `await`: assigning it directly makes
   * TypeScript's control-flow analysis believe it is still whatever this function
   * last set it to, which narrows a later `if (pendingPatch)` to `never` even though
   * another edit may well have landed while the request was out. Assignment through
   * a function is opaque to that analysis, which here is the accurate answer.
   */
  const setPending = (next: SheetPatch | undefined): void => {
    pendingPatch = next;
    syncDirty();
  };

  const clearFlushTimers = (): void => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (maxWaitTimer) {
      clearTimeout(maxWaitTimer);
    }

    debounceTimer = null;
    maxWaitTimer = null;
  };

  /**
   * Clears only the saved-badge timer. The retry timer deliberately survives this:
   * outliving the route to keep retrying is the reason this is a store rather than a
   * composable, so the sheet unmounting must not cancel a retry.
   */
  const stopBadgeTimer = (): void => {
    if (savedBadgeTimer) {
      clearTimeout(savedBadgeTimer);
    }

    savedBadgeTimer = null;
  };

  const markSaved = (): void => {
    saveState.value = 'saved';
    stopBadgeTimer();

    savedBadgeTimer = setTimeout(() => {
      savedBadgeTimer = null;

      if (saveState.value === 'saved') {
        saveState.value = 'idle';
      }
    }, SAVED_BADGE_MS);
  };

  /** Mirrors the pending patch onto the row it was derived from. */
  const writePendingToBuffer = (): void => {
    if (!characterId || !pendingPatch) {
      return;
    }

    const detail = readCachedDetail(qc, characterId);

    if (!detail) {
      return;
    }

    writeBuffer(characterId, detail.sheet.lastWriteSeq, pendingPatch);
  };

  /** Throttled, leading-edge-suppressed: at most one mirror per BUFFER_WRITE_MS. */
  const scheduleBufferWrite = (): void => {
    if (bufferTimer) {
      return;
    }

    bufferTimer = setTimeout(() => {
      bufferTimer = null;
      writePendingToBuffer();
    }, BUFFER_WRITE_MS);
  };

  const reset = (): void => {
    clearFlushTimers();
    stopBadgeTimer();

    if (retryTimer) {
      clearTimeout(retryTimer);
    }

    if (bufferTimer) {
      clearTimeout(bufferTimer);
    }

    retryTimer = null;
    bufferTimer = null;
    inFlightPatch = undefined;
    isFrozen = false;
    saveState.value = 'idle';
    setPending(undefined);
  };

  /**
   * `flush` rethrows so an awaiting caller sees the failure. Every fire-and-forget
   * trigger goes through this instead: the retry ladder and the error badge *are*
   * the error handling, so an unhandled rejection would be noise.
   */
  const requestFlush = (attempt = 0): void => {
    void flush(attempt).catch(() => {
      /* the retry ladder has it */
    });
  };

  /**
   * Note that an edit landing mid-ladder restarts `attempt` at zero, so `MAX_RETRIES`
   * caps a *quiet* failing endpoint rather than an actively-edited one. That is
   * deliberate: a player still typing has not given up, so neither should this.
   */
  const scheduleRetry = (attempt: number): void => {
    if (retryTimer) {
      clearTimeout(retryTimer);
    }

    retryTimer = setTimeout(
      () => {
        retryTimer = null;
        requestFlush(attempt);
      },
      RETRY_BASE_MS * 2 ** (attempt - 1),
    );
  };

  /**
   * The acked row is truth for the fields it carried, but anything queued while the
   * request was out is newer, so it goes back on top. Without this the field visibly
   * snaps to its pre-edit value for a whole round trip before the follow-up flush
   * corrects it - the same "under anything newer" rule the failure path applies.
   */
  const adoptAckedSheet = (id: string, sheet: CharacterSheet): void => {
    writeCachedSheet(qc, id, pendingPatch ? { ...sheet, ...pendingPatch } : sheet);
  };

  const flush = async (attempt = 0): Promise<void> => {
    clearFlushTimers();

    const id = characterId;
    const patch = pendingPatch;

    /**
     * Single-flight: a request already out is left alone. Whatever is pending gets
     * picked up by the follow-up flush when this one settles.
     */
    if (!id || !patch || inFlightPatch || isFrozen) {
      return;
    }

    inFlightPatch = patch;
    setPending(undefined);
    saveState.value = 'saving';

    try {
      const sheet = await updateSheet({ id, patch });

      /**
       * The attached character can change while a request is out. The ack still
       * makes that character's buffer stale, but nothing below it is about `id` any
       * more, so it must not run.
       */
      if (characterId !== id) {
        clearBuffer(id);

        return;
      }

      inFlightPatch = undefined;
      syncDirty();

      adoptAckedSheet(id, sheet);

      /** Edited again while in flight - send the newer working copy. */
      if (pendingPatch) {
        /** Rebased onto the row that just landed rather than left unprotected. */
        writeBuffer(id, sheet.lastWriteSeq, pendingPatch);

        /**
         * The follow-up owns its own failure - re-queue, badge, retry ladder - so
         * its rejection must not reach this frame's `catch`, which would pile the
         * fields that just acked back on top of it.
         */
        await flush().catch(() => {
          /* handled one frame down */
        });

        return;
      }

      /** The ack is what makes the buffer redundant, not the next attach. */
      clearBuffer(id);
      markSaved();
    } catch (error) {
      /**
       * A patch for a character we are no longer attached to must not be re-queued:
       * the pending slot belongs to a different character now, and merging into it
       * would write one character's values onto another.
       */
      if (characterId !== id) {
        throw error;
      }

      inFlightPatch = undefined;

      /**
       * Merge the failed fields back *under* anything newer: the retry must re-read
       * the current working copy, never resend a stale payload.
       */
      setPending({ ...patch, ...pendingPatch });
      saveState.value = 'error';

      if (attempt < MAX_RETRIES) {
        scheduleRetry(attempt + 1);
      }

      throw error;
    }
  };

  const scheduleFlush = (): void => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      requestFlush();
    }, DEBOUNCE_MS);

    /** Constant nudging (holding an hp stepper) must not defer a flush forever. */
    if (!maxWaitTimer) {
      maxWaitTimer = setTimeout(() => {
        maxWaitTimer = null;
        requestFlush();
      }, MAX_WAIT_MS);
    }
  };

  /**
   * Queue an edit. `immediate` skips the debounce for single-shot edits - conditions,
   * death saves, inspiration - which have no follow-up write to carry them if the tab
   * is backgrounded. Repeated fields (hp, counters) are self-healing because the next
   * tick resends the absolute value.
   */
  const patchSheet = (patch: SheetPatch, immediate = false): void => {
    if (!characterId) {
      /** Dropping this silently is how an edit made before the fetch resolves vanishes. */
      console.warn('useSheetAutosave: no character attached, patch dropped', patch);

      return;
    }

    setPending({ ...pendingPatch, ...patch });
    mergeCachedSheet(qc, characterId, patch);
    scheduleBufferWrite();

    if (immediate) {
      clearFlushTimers();
      requestFlush();

      return;
    }

    scheduleFlush();
  };

  /**
   * Best-effort save on page teardown: a plain PATCH does not survive it, so the
   * request goes out with `keepalive`. The localStorage buffer is the real durability
   * net, which is why it is mirrored synchronously here - this is the last chance.
   */
  const flushOnTeardown = (): void => {
    if (!characterId || !pendingPatch) {
      return;
    }

    writePendingToBuffer();
    sendSheetPatchOnTeardown(characterId, pendingPatch);
  };

  /**
   * Adopt a fetched row, replaying a buffered patch only if it was derived from that
   * exact row.
   *
   * Called from a `watch` on the cached character, which changes on every optimistic
   * echo, so re-attaching the same character has to be free. It also must not re-read
   * the buffer on those repeat calls: that read used to be the only thing clearing the
   * buffer after an ack, so the guard and the `clearBuffer` in the flush had to move
   * together.
   */
  const attach = (id: string, sheet: CharacterSheet): void => {
    if (characterId === id) {
      return;
    }

    reset();
    characterId = id;

    const buffered = takeBufferFor(id, sheet);

    if (!buffered) {
      return;
    }

    setPending(buffered);
    scheduleFlush();
  };

  const detach = (): void => {
    requestFlush();
  };

  /**
   * The shared choreography for the three atomic actions (rest, level-up, setup):
   * flush pending, freeze so autosave cannot race the write, POST, adopt the state
   * that comes back, then clear the dirty slot and the buffer. None of the three
   * re-implements it, and autosave never fights the reset.
   *
   * **This has never executed.** Nothing calls it and no action endpoint exists yet;
   * `rest` is the first thing that will, and should verify it rather than trust it.
   */
  const runServerAction = async <T extends { sheet: CharacterSheet }>(
    endpoint: string,
    body: unknown,
  ): Promise<T> => {
    const id = characterId;

    if (!id) {
      throw new Error('No character attached');
    }

    await flush().catch(() => {
      /* a failed pre-flush is already queued for retry; the action still owns the row */
    });

    isFrozen = true;

    try {
      const adopted = await runCharacterAction<T>(id, endpoint, body);

      setPending(undefined);
      clearBuffer(id);
      writeCachedSheet(qc, id, adopted.sheet);
      void qc.invalidateQueries({ queryKey: characterQueries.character(id) });

      return adopted;
    } finally {
      isFrozen = false;
    }
  };

  return {
    saveState,
    hasUnsavedChanges: isDirty,
    attach,
    detach,
    patchSheet,
    flush,
    flushOnTeardown,
    runServerAction,
    stopBadgeTimer,
  };
});
