import type { ComputedRef } from 'vue';

import type { CharacterSheet, InventoryItem } from '@shared/api/characters';

import type { AbilityScores } from '@entities/characters';

export interface UseAbilityTotalsParams {
  sheet: ComputedRef<CharacterSheet | undefined>;
  items: ComputedRef<InventoryItem[]>;
}

export interface UseAbilityTotals {
  /** The stored scores, before equipped items. The editable half. */
  rawScores: ComputedRef<AbilityScores>;
  /** Raw plus equipped-item bonuses — what the sheet displays and rolls with. */
  totals: ComputedRef<AbilityScores>;
}
