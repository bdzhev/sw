<script setup lang="ts">
import { computed } from 'vue';

import { useBreakpoint } from '@shared/lib/ui';
import { ConfirmDialog } from '@shared/ui/confirm-dialog';
import { DialogRoot } from '@shared/ui/dialog';
import { Separator } from '@shared/ui/separator';

import { useTraitsTab } from '@widgets/character-sheet/model/traits';
import { DetailDialog } from '@widgets/character-sheet/ui/detail-dialog';

import { QuickReference } from './quick-reference';
import { ResourceDialog } from './resource-dialog';
import { ResourcesList } from './resources-list';
import { TraitDialog } from './trait-dialog';
import { TraitsList } from './traits-list';

/**
 * Only writes are wired from here. Which dialog is open — and about what — is
 * the rows' business with `useTraitsUi`, so those events do not travel.
 */
const {
  pinnedTraits,
  pinnedResources,
  allTraits,
  allResources,
  isSavingTrait,
  isSavingResource,
  isTraitDialogOpen,
  editedTrait,
  isResourceDialogOpen,
  editedResource,
  isDetailOpen,
  detail,
  isDeleteOpen,
  pendingDelete,
  confirmDelete,
  submitTrait: handleSubmitTrait,
  submitResource: handleSubmitResource,
  toggleTraitPin: handleTraitTogglePin,
  toggleResourcePin: handleResourceTogglePin,
  spendResource: handleSpend,
} = useTraitsTab();

const { isDesktop } = useBreakpoint();

/** The two lists sit side by side from lg, so the rule between them turns with them. */
const separatorOrientation = computed(() => {
  return isDesktop.value ? 'vertical' : 'horizontal';
});
</script>

<template>
  <section class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
    <QuickReference
      :traits="pinnedTraits"
      :resources="pinnedResources"
      :is-saving="isSavingTrait || isSavingResource"
      @trait-toggle-pin="handleTraitTogglePin"
      @resource-toggle-pin="handleResourceTogglePin"
      @spend="handleSpend"
    />

    <div class="flex flex-col gap-4 lg:flex-row">
      <TraitsList
        :traits="allTraits"
        :is-saving="isSavingTrait"
        class="lg:min-w-0 lg:flex-1"
        @toggle-pin="handleTraitTogglePin"
      />

      <Separator :orientation="separatorOrientation" />

      <ResourcesList
        :resources="allResources"
        :is-saving="isSavingResource"
        class="lg:min-w-0 lg:flex-1"
        @toggle-pin="handleResourceTogglePin"
        @spend="handleSpend"
      />
    </div>

    <TraitDialog
      v-model:open="isTraitDialogOpen"
      :trait="editedTrait"
      :is-saving="isSavingTrait"
      @submit="handleSubmitTrait"
    />

    <ResourceDialog
      v-model:open="isResourceDialogOpen"
      :resource="editedResource"
      :is-saving="isSavingResource"
      @submit="handleSubmitResource"
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
        dialog-description="This removes it from the sheet. There is no undo."
        confirm-button-text="Delete"
        :is-loading="isSavingTrait || isSavingResource"
        :on-confirm="confirmDelete"
      />
    </DialogRoot>
  </section>
</template>
