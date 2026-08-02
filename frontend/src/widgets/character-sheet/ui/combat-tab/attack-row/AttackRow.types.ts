import type { Attack, CharacterSheet, InventoryItem } from '@shared/api/characters';

export interface AttackRowProps {
  attack: Attack;
  sheet: CharacterSheet;
  items: InventoryItem[];
  /** A write is in flight, so the row's own controls stop accepting taps. */
  isBusy?: boolean;
}
