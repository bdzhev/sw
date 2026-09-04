import type { ComputedRef, Ref } from 'vue';

import type { CharacterDetail, CharacterSheet, SheetPatch } from '@shared/api/characters';

export interface UseSheetShell {
  characterId: string;
  character: Ref<CharacterDetail | undefined>;
  /** undefined until the query resolves — callers render a skeleton. */
  sheet: ComputedRef<CharacterSheet | undefined>;
  isFetchingCharacter: Ref<boolean>;
  handlePatch: (patch: SheetPatch, immediate?: boolean) => void;
}
