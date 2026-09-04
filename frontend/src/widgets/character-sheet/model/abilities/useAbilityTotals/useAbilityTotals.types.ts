import type { ComputedRef } from 'vue';

import type { CharacterSheet, InventoryItem } from '@shared/api/characters';

export interface UseAbilityTotalsParams {
  sheet: ComputedRef<CharacterSheet | undefined>;
  items: ComputedRef<InventoryItem[]>;
}
