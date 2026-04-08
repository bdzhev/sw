<script setup lang="ts">
import { useForm } from 'vee-validate';
import { inject, computed } from 'vue';

import {
  ModalPortal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalCloseButton,
  ModalOverlay,
  ModalCloser,
  ModalRoot,
} from '@shared/ui/modal';

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

const handleUpdateSuccess = () => {
  if (!dropdownCtx.isEditModalOpen) {
    return;
  }

  dropdownCtx.toggleEditModal();
};

const { updateCharacter, isUpdating } = useUpdateCharacter({
  onSuccess: handleUpdateSuccess,
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
</script>

<template>
  <ModalRoot v-model:open="dropdownCtx.isEditModalOpen.value" is-controlled :disable-outside-click-close="isUpdating"
    v-on:modal-open="editCharForm.resetForm({ values: initialValues })">
    <ModalPortal>
      <ModalOverlay />

      <ModalContent>
        <CfProvider v-on:submit="handleSubmit" :form-context="editCharForm">
          <ModalHeader>
            <ModalTitle>
              {{ 'Edit character' }}
            </ModalTitle>

            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <CfInput name="name" label="Name" />
          </ModalBody>

          <ModalFooter>
            <div class="flex flex-row gap-2">
              <ModalCloser>
                <CfFooterCancelButton variant="secondary" :is-disabled="isUpdating">
                  {{ 'Cancel' }}
                </CfFooterCancelButton>
              </ModalCloser>

              <CfFooterSubmitButton :is-loading="isUpdating">
                {{ 'Save' }}
              </CfFooterSubmitButton>
            </div>
          </ModalFooter>
        </CfProvider>
      </ModalContent>
    </ModalPortal>
  </ModalRoot>
</template>
