<script setup lang="ts">
import { ToastCloseButton } from '../../toast-close-button';
import { ToastDescription } from '../../toast-description';
import { ToastTitle } from '../../toast-title';
import Toast from '../../Toast.vue';
import type { ToastItemProps } from './ToastItem.types';

const props = defineProps<ToastItemProps>();

const emit = defineEmits<{ dismiss: [id: number] }>();

/** The queue is keyed by id, and only the row knows which one it is. */
const handleOpenChange = (isOpen: boolean): void => {
  if (isOpen) {
    return;
  }

  emit('dismiss', props.entry.id);
};
</script>

<template>
  <Toast
    :open="props.entry.isOpen"
    :variant="props.entry.variant"
    class="relative"
    @update:open="handleOpenChange"
  >
    <ToastTitle>{{ props.entry.title }}</ToastTitle>

    <ToastDescription v-if="props.entry.description">
      {{ props.entry.description }}
    </ToastDescription>

    <ToastCloseButton />
  </Toast>
</template>
