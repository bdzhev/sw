<script setup lang="ts">
import { ToastProvider } from 'reka-ui';

import { useToast } from '@shared/lib/ui';

import { ToastViewport } from '../toast-viewport';
import { ToastItem } from './toast-item';

const { toasts, dismissToast } = useToast();

const handleDismiss = (id: number): void => {
  dismissToast(id);
};
</script>

<template>
  <ToastProvider>
    <ToastItem
      v-for="toast in toasts"
      :key="toast.id"
      :entry="toast"
      @dismiss="handleDismiss"
    />

    <ToastViewport />
  </ToastProvider>
</template>
