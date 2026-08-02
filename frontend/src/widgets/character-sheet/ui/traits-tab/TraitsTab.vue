<script setup lang="ts">
import { ConfirmDialog } from '@shared/ui/confirm-dialog';
import { DialogRoot } from '@shared/ui/dialog';

import { useTraitsTab } from '@widgets/character-sheet/model/traits/useTraitsTab';

import { DetailDialog } from './detail-dialog';
import { QuickReference } from './quick-reference';
import { ResourceDialog } from './resource-dialog';
import { ResourcesList } from './resources-list';
import { TraitDialog } from './trait-dialog';
import { TraitsList } from './traits-list';

const {
  pinnedTraits,
  pinnedResources,
  listedTraits,
  listedResources,
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
  openTraitDialog,
  openResourceDialog,
  openTraitDetail,
  openResourceDetail,
  askDeleteTrait,
  askDeleteResource,
  confirmDelete,
  submitTrait,
  submitResource,
  toggleTraitPin,
  toggleResourcePin,
  spendResource,
} = useTraitsTab();
</script>

<template>
  <section class="flex flex-col gap-6 py-6">
    <QuickReference
      :traits="pinnedTraits"
      :resources="pinnedResources"
      :is-saving="isSavingTrait || isSavingResource"
      @trait-info="openTraitDetail"
      @trait-edit="openTraitDialog"
      @trait-remove="askDeleteTrait"
      @trait-toggle-pin="toggleTraitPin"
      @resource-info="openResourceDetail"
      @resource-edit="openResourceDialog"
      @resource-remove="askDeleteResource"
      @resource-toggle-pin="toggleResourcePin"
      @spend="spendResource"
    />

    <TraitsList
      :traits="listedTraits"
      :is-saving="isSavingTrait"
      @add="openTraitDialog(null)"
      @info="openTraitDetail"
      @edit="openTraitDialog"
      @remove="askDeleteTrait"
      @toggle-pin="toggleTraitPin"
    />

    <ResourcesList
      :resources="listedResources"
      :is-saving="isSavingResource"
      @add="openResourceDialog(null)"
      @info="openResourceDetail"
      @edit="openResourceDialog"
      @remove="askDeleteResource"
      @toggle-pin="toggleResourcePin"
      @spend="spendResource"
    />

    <TraitDialog
      v-model:open="isTraitDialogOpen"
      :trait="editedTrait"
      :is-saving="isSavingTrait"
      @submit="submitTrait"
    />

    <ResourceDialog
      v-model:open="isResourceDialogOpen"
      :resource="editedResource"
      :is-saving="isSavingResource"
      @submit="submitResource"
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
