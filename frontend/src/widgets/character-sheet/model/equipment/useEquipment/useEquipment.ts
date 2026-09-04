import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { CollectionKey, MAX_ITEMS } from '@shared/api/characters';
import type { InventoryItem, SheetPatch } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';

import {
  useCharacter,
  useCharacterCollection,
  useSheetAutosave,
} from '@entities/characters';

import { useEquipmentUi } from '../useEquipmentUi';
import type { ItemSubmitValues } from '../useItemForm';
import type { UseEquipment } from './useEquipment.types';

/**
 * The data half of the equipment subpage: rows derived from the cached sheet, and
 * the writes. Dialog state lives in useEquipmentUi, which is a store because it
 * has to be a singleton — see the note there.
 */
export const useEquipment = (): UseEquipment => {
  const route = useRoute(RouteName.APP_CHARACTER_ITEMS);
  const ui = useEquipmentUi();

  const characterId = route.params.id;

  const { character } = useCharacter({ id: characterId });
  const autosave = useSheetAutosave();

  const items = useCharacterCollection(CollectionKey.INVENTORY_ITEMS, {
    characterId: characterId,
  });

  const sheet = computed(() => {
    return character.value?.sheet;
  });

  const allItems = computed(() => {
    return character.value?.inventoryItems ?? [];
  });

  const isSavingItem = computed(() => {
    return items.isCreating.value || items.isUpdating.value || items.isDeleting.value;
  });

  const hasReachedItemLimit = computed(() => {
    return allItems.value.length >= MAX_ITEMS;
  });

  const submitItem = async (values: ItemSubmitValues): Promise<void> => {
    const edited = ui.editedItem;

    try {
      if (edited) {
        await items.updateRow({ rowId: edited.id, patch: values });
      } else {
        await items.createRow(values);
      }
    } catch {
      return;
    }

    ui.closeItemDialog();
  };

  const toggleItemPin = (item: InventoryItem): void => {
    void items.updateRow({
      rowId: item.id,
      patch: { quickReference: !item.quickReference },
    });
  };

  const toggleEquipped = (item: InventoryItem): void => {
    void items.updateRow({ rowId: item.id, patch: { isEquipped: !item.isEquipped } });
  };

  /**
   * Flat one per tap — potions and scrolls are one-per-activation, so there is no
   * cost sublist like the class resource control has.
   *
   * `usesRemaining` is a counter, so the plan wants it on the autosave channel —
   * but the controller writes the sheet row and nothing else, and standing up a
   * sub-entity target is not this subpage's call. Absolute value, never a delta,
   * so the move is a one-line change once that target exists.
   */
  const spendUse = (item: InventoryItem): void => {
    const next = Math.max(0, (item.usesRemaining ?? 0) - 1);

    if (next === item.usesRemaining) {
      return;
    }

    void items.updateRow({ rowId: item.id, patch: { usesRemaining: next } });
  };

  const confirmDelete = async (): Promise<void> => {
    try {
      await items.deleteRow(ui.pendingDelete.rowId);
    } catch {
      return;
    }

    ui.closeDelete();
  };

  /** Currency is a `character_sheets` column, so it rides the autosave debounce. */
  const patchCurrency = (patch: SheetPatch): void => {
    autosave.patchSheet(patch);
  };

  const {
    isItemDialogOpen,
    editedItem,
    isDetailOpen,
    detail,
    isDeleteOpen,
    pendingDelete,
  } = storeToRefs(ui);

  return {
    sheet,
    items: allItems,
    isSavingItem,
    hasReachedItemLimit,
    isItemDialogOpen,
    editedItem,
    isDetailOpen,
    detail,
    isDeleteOpen,
    pendingDelete,
    submitItem,
    toggleItemPin,
    toggleEquipped,
    spendUse,
    confirmDelete,
    patchCurrency,
  };
};
