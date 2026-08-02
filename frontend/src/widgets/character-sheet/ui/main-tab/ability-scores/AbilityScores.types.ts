import type { CharacterSheet, InventoryItem } from '@shared/api/characters';

export interface AbilityScoresProps {
  sheet: CharacterSheet;
  /** Equipped items add score bonuses; the totals are derived, never stored. */
  items: InventoryItem[];
}
