<script setup lang="ts">
import { BasicConfirmModal, ValidationConfirmModal } from './components';
import type { ConfirmModalProps } from './ConfirmModal.props';

const props = defineProps<ConfirmModalProps>();
</script>

<template>
  <ValidationConfirmModal v-if="props.type === 'validation'" :confirmation-text="props.confirmationText"
    :confirmation-label="props.confirmationLabel" :action-type="props.actionType" :modal-title="props.modalTitle"
    :modal-description="props.modalDescription" :confirm-button-text="props.confirmButtonText"
    :is-loading="props.isLoading" />

  <BasicConfirmModal :action-type="props.actionType" :modal-title="props.modalTitle"
    :modal-description="props.modalDescription" :confirm-button-text="props.confirmButtonText"
    :is-loading="props.isLoading" v-else />
</template>
