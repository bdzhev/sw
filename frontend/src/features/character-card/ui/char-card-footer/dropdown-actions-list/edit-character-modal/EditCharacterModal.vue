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
import { FormInput } from '@shared/ui/form-input';

import { useUpdateCharacter } from '@entities/characters';

import { editCharFormSchema } from '@features/character-card/config/editForm.schema';
import type { CharCardContext } from '@features/character-card/ui/char-card-root';
import {
  CancelButton,
  CharacterFormProvider,
  SubmitButton,
} from '@features/character-form';

import type { DropdownActionsContext } from '../DropdownActionsList.types';

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

const handleCancel = () => {
  closeDialog();
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

const submitEdit = editCharForm.handleSubmit((vals) => {
  updateCharacter({
    id: charCardCtx.id,
    name: vals.name,
  });
});

const handleSubmit = (event?: Event) => {
  void submitEdit(event);
};

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
        <CharacterFormProvider :form-context="editCharForm" @submit="handleSubmit">
          <DialogHeader>
            <DialogTitle>
              {{ 'Edit character' }}
            </DialogTitle>

            <DialogCloseButton />
          </DialogHeader>

          <DialogBody>
            <FormInput name="name" label="Name" />
          </DialogBody>

          <DialogFooter>
            <div class="flex flex-row justify-end gap-2">
              <CancelButton :is-disabled="isUpdating" @cancel="handleCancel">
                {{ 'Cancel' }}
              </CancelButton>

              <SubmitButton :is-loading="isUpdating">
                {{ 'Save' }}
              </SubmitButton>
            </div>
          </DialogFooter>
        </CharacterFormProvider>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
