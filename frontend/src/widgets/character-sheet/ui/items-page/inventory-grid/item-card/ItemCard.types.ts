import type { InventoryItem } from '@shared/api/characters';

export interface ItemCardProps {
  item: InventoryItem;
  isSaving?: boolean;
}
