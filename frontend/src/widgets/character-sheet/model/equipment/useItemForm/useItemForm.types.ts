import type { CharacterStat, InventoryItem } from '@shared/api/characters';

/** What the dialog hands back — already shaped like an `items` create/patch body. */
export interface ItemSubmitValues {
  name: string;
  description: string | null;
  quantity: number;
  maxUses: number | null;
  usesRemaining: number | null;
  resetOnLongRest: boolean;
  statModifiers: Partial<Record<CharacterStat, number>>;
  isEquipped: boolean;
  quickReference: boolean;
}

export interface UseItemFormOptions {
  /** null while adding rather than editing. */
  getItem: () => InventoryItem | null;
  isOpen: () => boolean;
  onSubmit: (values: ItemSubmitValues) => void;
}
