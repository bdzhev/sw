import type { InventoryItem } from '@shared/api/characters';

export interface ItemDialogProps {
  /** null while adding rather than editing. */
  item: InventoryItem | null;
  isSaving?: boolean;
}
