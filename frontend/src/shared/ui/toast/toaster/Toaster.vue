<script setup lang="ts">
import { ToastProvider } from 'reka-ui';

import { useToast } from '@shared/lib/ui';

import { ToastCloseButton } from '../toast-close-button';
import { ToastDescription } from '../toast-description';
import { ToastTitle } from '../toast-title';
import { ToastViewport } from '../toast-viewport';
import Toast from '../Toast.vue';

const { toasts, dismissToast } = useToast();

const handleOpenChange = (id: number, isOpen: boolean) => {
  if (!isOpen) {
    dismissToast(id);
  }
};
</script>

<template>
  <ToastProvider>
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :variant="toast.variant"
      class="relative"
      @update:open="handleOpenChange(toast.id, $event)"
    >
      <ToastTitle>{{ toast.title }}</ToastTitle>

      <ToastDescription v-if="toast.description">
        {{ toast.description }}
      </ToastDescription>

      <ToastCloseButton />
    </Toast>

    <ToastViewport />
  </ToastProvider>
</template>
