import type { Attack, CharacterSheet, InventoryItem } from '@shared/api/characters';

export interface AttackDetailDialogProps {
  open: boolean;
  /** Null while closed — the dialog holds no copy of the row. */
  attack: Attack | null;
  sheet: CharacterSheet;
  items: InventoryItem[];
}
