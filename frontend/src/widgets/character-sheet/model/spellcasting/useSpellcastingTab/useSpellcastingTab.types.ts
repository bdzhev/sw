import type { ComputedRef, Ref } from 'vue';

import type {
  CharacterClass,
  CharacterDetail,
  CharacterSheet,
  CharacterSpell,
  CharacterStat,
  SheetPatch,
  SpellcastingProgression,
} from '@shared/api/characters';

import type { SlotTableMaxima } from '@entities/characters';

import type { SpellBody } from '@widgets/character-sheet/config/spellcasting';

/**
 * Written down rather than inferred, because the width is the point: eighteen
 * members is what "the data half of a tab" costs, and typing it out is the only
 * way to notice. Grouped by what each half is for.
 */
export interface UseSpellcastingTab {
  /** The cached row, exposed whole because the tab's children still read it. */
  character: Ref<CharacterDetail | undefined>;
  sheet: ComputedRef<CharacterSheet | undefined>;
  characterClass: ComputedRef<CharacterClass | null>;
  allSpells: ComputedRef<CharacterSpell[]>;

  /** Derived casting stats. `null` means the character does not cast. */
  progression: ComputedRef<SpellcastingProgression>;
  isPactMagic: ComputedRef<boolean>;
  castingAbility: ComputedRef<CharacterStat | null>;
  saveDc: ComputedRef<number | null>;
  attackBonus: ComputedRef<number | null>;

  /** Slots. `tableMaxima` is `null` when the class has no table to fill from. */
  slotLevels: ComputedRef<number[]>;
  tableMaxima: ComputedRef<SlotTableMaxima | null>;
  maxCastableLevel: ComputedRef<number>;

  /** Which reference spells are already on the list, so the search can disable them. */
  addedSpellIds: ComputedRef<Set<string>>;

  isSavingSpell: ComputedRef<boolean>;

  /**
   * Writes. Note the two protocols: `patchSheet`/`castAtLevel` go through
   * autosave and return nothing, while `addSpell`/`deleteSpell` are discrete
   * calls that report success so the caller can decide whether to close.
   */
  patchSheet: (patch: SheetPatch, immediate?: boolean) => void;
  castAtLevel: (slotLevel: number) => void;
  addSpell: (body: SpellBody) => Promise<boolean>;
  deleteSpell: (rowId: string) => Promise<boolean>;
}
