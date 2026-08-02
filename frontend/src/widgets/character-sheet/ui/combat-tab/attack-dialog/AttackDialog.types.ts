import type { Attack, CharacterSheet, InventoryItem } from '@shared/api/characters';

export interface AttackDialogProps {
  open: boolean;
  /** Null = add mode. One dialog serves both, per the design doc. */
  attack: Attack | null;
  sheet: CharacterSheet;
  items: InventoryItem[];
  isSaving?: boolean;
}
