<script setup lang="ts">
import { inject } from 'vue';

import { ConfirmDialog } from '@shared/ui/confirm-dialog';
import { DialogRoot } from '@shared/ui/dialog';

import { useDeleteCharacter } from '@entities/characters';

import type { CharCardContext } from '../../../../../CharCardRoot.types';
import type { DropdownActionsContext } from '../../DropdownActionsList.types';

const { deleteCharacter, isDeletingCharacter } = useDeleteCharacter();

const charCardCtx = inject<CharCardContext>('charCardCtx')!;
const dropdownCtx = inject<DropdownActionsContext>('dropdownMenuActions')!;

/** Closing is per-call, not in the hook: the hook has no idea who opened it. */
const handleConfirmDelete = () => {
  deleteCharacter(charCardCtx.id, {
    onSuccess: () => {
      dropdownCtx.isDeleteModalOpen.value = false;
    },
  });
};
</script>

<template>
  <DialogRoot v-model:open="dropdownCtx.isDeleteModalOpen.value">
    <ConfirmDialog
      type="validation"
      :is-loading="isDeletingCharacter"
      :confirmation-text="charCardCtx?.name || ''"
      confirmation-label="Enter the name of your character to confirm"
      action-type="negative"
      :dialog-title="`Delete ${charCardCtx?.name}?`"
      :dialog-description="'You wont be able to recover the character'"
      @confirm="handleConfirmDelete"
    />
  </DialogRoot>
</template>
