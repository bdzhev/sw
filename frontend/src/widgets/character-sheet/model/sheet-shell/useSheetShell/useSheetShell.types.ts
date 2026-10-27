import type { ComputedRef, Ref } from 'vue';

import type { CharacterDetail, CharacterSheet, SheetPatch } from '@shared/api/characters';

import type { SaveState } from '@entities/characters';

export interface UseSheetShell {
  characterId: string;
  character: Ref<CharacterDetail | undefined>;
  /** undefined until the query resolves — callers render a skeleton. */
  sheet: ComputedRef<CharacterSheet | undefined>;
  isFetchingCharacter: Ref<boolean>;
  /** A method, not a handler — components name their own `handle*` and bind that. */
  patchSheet: (patch: SheetPatch, immediate?: boolean) => void;
  /**
   * The atomic-action door: flush, freeze, POST, adopt what comes back. Rest is
   * the first caller; level-up and start-up are the other two. It lives on the
   * context for the same reason `patchSheet` does — a tab reaching for
   * `useSheetAutosave()` itself goes around the seam the shell owns.
   */
  runAction: <T extends Partial<CharacterDetail> & { sheet: CharacterSheet }>(
    endpoint: string,
    body: unknown,
  ) => Promise<T>;
  saveState: Ref<SaveState>;
  hasUnsavedChanges: Ref<boolean>;
}

/**
 * What a sheet surface hands down to its tabs.
 *
 * The shell owns the autosave lifecycle — it registers the teardown listeners —
 * so a tab that called `useSheetAutosave()` itself was reaching around the seam
 * rather than through it. It cannot simply call `useSheetShell` instead: a
 * second call would register a second set of `visibilitychange`/`pagehide`
 * listeners. Hence a context, provided by the one surface that owns it.
 */
export type SheetContext = Omit<UseSheetShell, 'isFetchingCharacter'>;
