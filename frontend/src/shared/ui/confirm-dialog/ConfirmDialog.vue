<script setup lang="ts">
import { BasicConfirmDialog } from './basic-confirm-dialog';
import type { ConfirmDialogProps } from './ConfirmDialog.types';
import { ValidationConfirmDialog } from './validation-confirm-dialog';

const props = defineProps<ConfirmDialogProps>();
</script>

<template>
  <ValidationConfirmDialog
    v-if="props.type === 'validation'"
    :confirmation-text="props.confirmationText"
    :confirmation-label="props.confirmationLabel"
    :action-type="props.actionType"
    :dialog-title="props.dialogTitle"
    :dialog-description="props.dialogDescription"
    :confirm-button-text="props.confirmButtonText"
    :is-loading="props.isLoading"
    :on-confirm="props.onConfirm"
  />

  <BasicConfirmDialog
    v-else
    :action-type="props.actionType"
    :dialog-title="props.dialogTitle"
    :dialog-description="props.dialogDescription"
    :confirm-button-text="props.confirmButtonText"
    :is-loading="props.isLoading"
    :on-confirm="props.onConfirm"
  />
</template>
