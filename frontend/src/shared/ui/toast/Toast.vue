<script setup lang="ts">
import { ToastRoot } from 'reka-ui';

import type { ToastProps } from './Toast.types';

defineOptions({ inheritAttrs: false });

const { variant = 'neutral' } = defineProps<ToastProps>();
</script>

<template>
  <ToastRoot
    v-bind="$attrs"
    class="flex flex-col gap-1 rounded-md border bg-bg-secondary px-4 py-3 shadow-xl data-[state=closed]:animate-toast-out data-[state=open]:animate-toast-in data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--reka-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] motion-reduce:animate-none"
    :class="variant === 'error' ? 'border-danger' : 'border-border'"
  >
    <slot />
  </ToastRoot>
</template>
