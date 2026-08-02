import type { CharacterSheet, InventoryItem } from '@shared/api/characters';

export interface InitiativePanelProps {
  sheet: CharacterSheet;
  /** Equipped items shift the dex score, so the total has to see them. */
  items: InventoryItem[];
}
