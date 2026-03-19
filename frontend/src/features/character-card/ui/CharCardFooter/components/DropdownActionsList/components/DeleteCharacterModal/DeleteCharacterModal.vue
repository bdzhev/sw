<script setup lang="ts">
import { inject } from 'vue';

import { ConfirmModal } from '@shared/ui/confirm-modal';
import { ModalRoot } from '@shared/ui/modal';

import { useDeleteCharacter } from '@entities/characters';

import type { CharCardContext } from '../../../../../CharCardRoot.types';
import type { DropdownActionsContext } from '../../DropdownActionsList.types';

const { deleteCharacter } = useDeleteCharacter();

const charCardCtx = inject<CharCardContext>('charCardCtx')!;
const dropdownCtx = inject<DropdownActionsContext>('dropdownMenuActions')!;

const handleConfirmDelete = () => {
  deleteCharacter(charCardCtx.id);
};
</script>

<template>
  <ModalRoot v-model:open="dropdownCtx.isDeleteModalOpen.value" is-controlled>
    <ConfirmModal
      type="validation"
      :confirmation-text="charCardCtx?.name || ''"
      confirmation-label="Enter the name of your character to confirm"
      action-type="negative"
      :modal-title="`Delete ${charCardCtx?.name}?`"
      :modal-description="'You wont be able to recover the character'"
      @confirm="handleConfirmDelete"
    />
  </ModalRoot>
</template>
