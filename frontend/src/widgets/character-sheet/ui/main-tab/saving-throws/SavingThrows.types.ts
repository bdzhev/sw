import type { CharacterSheet, InventoryItem } from '@shared/api/characters';

export interface SavingThrowsProps {
  sheet: CharacterSheet;
  /** Equipped items feed the ability modifier the total is built from. */
  items: InventoryItem[];
}
