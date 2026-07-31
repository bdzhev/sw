<script setup lang="ts">
import { useForm } from 'vee-validate';
import { inject, computed, watch } from 'vue';

import {
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';

import { useUpdateCharacter } from '@entities/characters';

import {
  CfFooterCancelButton,
  CfProvider,
  CfInput,
  CfFooterSubmitButton,
} from '@features/character-form';

import { editCharFormSchema } from '../../../../../../config/editForm.schema';
import type { CharCardContext } from '../../../../../CharCardRoot.types';
import type { DropdownActionsContext } from '../../DropdownActionsList.types';

const charCardCtx = inject<CharCardContext>('charCardCtx')!;
const dropdownCtx = inject<DropdownActionsContext>('dropdownMenuActions')!;

const initialValues = computed(() => {
  return {
    name: charCardCtx.name,
  };
});

const closeDialog = () => {
  if (!dropdownCtx.isEditModalOpen.value) {
    return;
  }

  dropdownCtx.toggleEditModal();
};

const { updateCharacter, isUpdating } = useUpdateCharacter({
  onSuccess: closeDialog,
});

const editCharForm = useForm({
  validationSchema: editCharFormSchema,
  initialValues: {
    name: charCardCtx.name,
  },
});

const handleSubmit = editCharForm.handleSubmit((vals) => {
  updateCharacter({
    id: charCardCtx.id,
    name: vals.name,
  });
});

/**
 * Replaces the modal's `onModalOpen` callback: the dialog primitive has no
 * equivalent hook, and watching the open state is what that callback was
 * standing in for anyway.
 */
watch(
  () => {
    return dropdownCtx.isEditModalOpen.value;
  },
  (isOpen) => {
    if (!isOpen) {
      return;
    }

    editCharForm.resetForm({ values: initialValues.value });
  },
);
</script>

<template>
  <DialogRoot v-model:open="dropdownCtx.isEditModalOpen.value">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent :disable-outside-close="isUpdating" :aria-describedby="undefined">
        <CfProvider v-on:submit="handleSubmit" :form-context="editCharForm">
          <DialogHeader>
            <DialogTitle>
              {{ 'Edit character' }}
            </DialogTitle>

            <DialogCloseButton />
          </DialogHeader>

          <DialogBody>
            <CfInput name="name" label="Name" />
          </DialogBody>

          <DialogFooter>
            <div class="flex flex-row gap-2">
              <CfFooterCancelButton
                variant="secondary"
                :is-disabled="isUpdating"
                :on-cancel-click="closeDialog"
              >
                {{ 'Cancel' }}
              </CfFooterCancelButton>

              <CfFooterSubmitButton :is-loading="isUpdating">
                {{ 'Save' }}
              </CfFooterSubmitButton>
            </div>
          </DialogFooter>
        </CfProvider>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
