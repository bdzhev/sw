import type { ComputedRef, Ref } from 'vue';

import type { CharacterSheet, InventoryItem, SheetPatch } from '@shared/api/characters';

import type { DetailPayload } from '@widgets/character-sheet/config/detail';

import type { PendingItemDelete } from '../useEquipmentUi';
import type { ItemSubmitValues } from '../useItemForm';

/**
 * The outcomes a caller may want to react to. See `UseTraitsTabOptions` for why
 * these are callbacks rather than a boolean return.
 */
export interface UseEquipmentOptions {
  onItemSubmitted?: () => void;
  onDeleted?: () => void;
}

export interface UseEquipment {
  /** undefined until the character query resolves — the subpage renders a skeleton. */
  sheet: ComputedRef<CharacterSheet | undefined>;
  items: ComputedRef<InventoryItem[]>;
  isSavingItem: ComputedRef<boolean>;
  hasReachedItemLimit: ComputedRef<boolean>;
  isItemDialogOpen: Ref<boolean>;
  editedItem: Ref<InventoryItem | null>;
  isDetailOpen: Ref<boolean>;
  detail: Ref<DetailPayload>;
  isDeleteOpen: Ref<boolean>;
  pendingDelete: Ref<PendingItemDelete>;
  submitItem: (values: ItemSubmitValues) => Promise<void>;
  toggleItemPin: (item: InventoryItem) => void;
  toggleEquipped: (item: InventoryItem) => void;
  spendUse: (item: InventoryItem) => void;
  confirmDelete: () => Promise<void>;
  patchCurrency: (patch: SheetPatch) => void;
}
