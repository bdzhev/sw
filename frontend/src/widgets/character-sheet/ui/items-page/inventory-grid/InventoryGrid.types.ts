import type { InventoryItem } from '@shared/api/characters';

export interface InventoryGridProps {
  items: readonly InventoryItem[];
  isSaving?: boolean;
  /** At the cap the Add control disables rather than firing a doomed request. */
  hasReachedLimit?: boolean;
}
