import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { InventoryItem } from '@shared/api/characters';

import { modifierSummary, usesPool } from '@widgets/character-sheet/lib/equipment';

import type { ItemDetailPayload, PendingItemDelete } from './useEquipmentUi.types';

/**
 * Which dialog is open, and what it is open *about*.
 *
 * A store rather than a composable because a composable is instantiated per
 * call: a card deep in the grid could not open a dialog, it would have to emit
 * up through the grid to the subpage. Same reasoning as useTraitsUi.
 *
 * Server state is deliberately absent — rows are derived from the TanStack cache
 * in useEquipment. Copying them here would be a second source of truth.
 */
export const useEquipmentUi = defineStore('equipmentUi', () => {
  const isItemDialogOpen = ref(false);
  const editedItem = ref<InventoryItem | null>(null);

  const isDetailOpen = ref(false);
  const detail = ref<ItemDetailPayload>({ title: '', description: null, meta: '' });

  const isDeleteOpen = ref(false);
  const pendingDelete = ref<PendingItemDelete>({ rowId: '', name: '' });

  /** `null` means "add", a row means "edit" — the dialog reads which from this. */
  const openItemDialog = (item: InventoryItem | null): void => {
    editedItem.value = item;
    isItemDialogOpen.value = true;
  };

  const closeItemDialog = (): void => {
    isItemDialogOpen.value = false;
  };

  const openItemDetail = (item: InventoryItem): void => {
    const parts = [usesPool(item), modifierSummary(item)].filter(Boolean);

    detail.value = {
      title: item.name,
      description: item.description,
      meta: parts.join(' · '),
    };
    isDetailOpen.value = true;
  };

  const askDeleteItem = (item: InventoryItem): void => {
    pendingDelete.value = { rowId: item.id, name: item.name };
    isDeleteOpen.value = true;
  };

  const closeDelete = (): void => {
    isDeleteOpen.value = false;
  };

  return {
    isItemDialogOpen,
    editedItem,
    isDetailOpen,
    detail,
    isDeleteOpen,
    pendingDelete,
    openItemDialog,
    closeItemDialog,
    openItemDetail,
    askDeleteItem,
    closeDelete,
  };
});
