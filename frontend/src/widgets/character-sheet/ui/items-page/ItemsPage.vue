<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

import { RouteName } from '@shared/lib/router';
import { BackButton } from '@shared/ui/back-button';
import { Button } from '@shared/ui/button';
import { ConfirmDialog } from '@shared/ui/confirm-dialog';
import { DialogRoot } from '@shared/ui/dialog';
import { Skeleton } from '@shared/ui/skeleton';

import { useSheetAutosave } from '@entities/characters';

import { useEquipment, useEquipmentUi } from '@widgets/character-sheet/model/equipment';
import { useSheetShell } from '@widgets/character-sheet/model/sheet-shell';
import { DetailDialog } from '@widgets/character-sheet/ui/detail-dialog';
import { StatusBar } from '@widgets/character-sheet/ui/status-bar';

import { CurrencyFields } from './currency-fields';
import { InventoryGrid } from './inventory-grid';
import { ItemDialog } from './item-dialog';

/**
 * A page, not a sixth tab and not a subpage in the tab slot: it carries its own
 * header and shows none of the sheet's chrome. `useSheetShell` is what lets it
 * own the autosave lifecycle without duplicating it — currency is a
 * `character_sheets` column, so this page writes the same row the sheet does.
 */
const { characterId, character, isFetchingCharacter, sheet, handlePatch } =
  useSheetShell();

const {
  items,
  isSavingItem,
  hasReachedItemLimit,
  isItemDialogOpen,
  editedItem,
  isDetailOpen,
  detail,
  isDeleteOpen,
  pendingDelete,
  submitItem: handleSubmitItem,
  toggleItemPin: handleTogglePin,
  toggleEquipped: handleToggleEquipped,
  spendUse: handleSpend,
  confirmDelete,
} = useEquipment();

const ui = useEquipmentUi();
const autosave = useSheetAutosave();

const sheetLink = computed<RouteLocationRaw>(() => {
  return { name: RouteName.APP_CHARACTER, params: { id: characterId, tab: 'main' } };
});

/** "Kara · items" reads as a place; "Items" alone could be anyone's. */
const title = computed(() => {
  return character.value ? `${character.value.character.name} · items` : 'Items';
});

const handleAddClick = (): void => {
  ui.openItemDialog(null);
};
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-1 flex-col gap-4 pb-6">
      <!-- Skeleton hardcodes `h-full w-full`, so its size has to come from a wrapper. -->
      <template v-if="isFetchingCharacter && !sheet">
        <div class="h-24 w-full">
          <Skeleton class="rounded-lg" />
        </div>

        <div class="h-96 w-full">
          <Skeleton class="rounded-lg" />
        </div>
      </template>

      <template v-else-if="sheet">
        <!--
          Full-bleed band matching the sheet's own header, so the two pages read
          as one place. Back button, title and Add sit on one centre line; Add is
          pushed right by the title group's `flex-1`.
        -->
        <header
          class="page-x-bleed flex items-center gap-x-2 border-b border-border bg-bg-secondary py-4 md:py-6"
        >
          <div class="flex min-w-0 flex-1 items-center gap-2">
            <BackButton
              :to="sheetLink"
              label="Back to the character sheet"
              class="-ml-1"
            />

            <h1 class="truncate text-2xl font-semibold text-primary">{{ title }}</h1>
          </div>

          <Button
            :is-disabled="hasReachedItemLimit"
            class="shrink-0"
            @click="handleAddClick"
          >
            <span class="flex items-center gap-1">
              <Plus :size="16" />

              <span class="hidden sm:inline">Add item</span>
            </span>
          </Button>
        </header>

        <CurrencyFields :sheet="sheet" @patch="handlePatch" />

        <InventoryGrid
          :items="items"
          :is-saving="isSavingItem"
          :has-reached-limit="hasReachedItemLimit"
          @toggle-pin="handleTogglePin"
          @toggle-equipped="handleToggleEquipped"
          @spend="handleSpend"
        />
      </template>

      <ItemDialog
        v-model:open="isItemDialogOpen"
        :item="editedItem"
        :is-saving="isSavingItem"
        @submit="handleSubmitItem"
      />

      <DetailDialog
        v-model:open="isDetailOpen"
        :title="detail.title"
        :description="detail.description"
        :meta="detail.meta"
      />

      <DialogRoot v-model:open="isDeleteOpen">
        <ConfirmDialog
          action-type="negative"
          :dialog-title="`Delete ${pendingDelete.name}?`"
          dialog-description="This removes it from your inventory. There is no undo."
          confirm-button-text="Delete"
          :is-loading="isSavingItem"
          :on-confirm="confirmDelete"
        />
      </DialogRoot>
    </div>

    <StatusBar
      :save-state="autosave.saveState"
      :has-unsaved-changes="autosave.hasUnsavedChanges"
    />
  </div>
</template>
