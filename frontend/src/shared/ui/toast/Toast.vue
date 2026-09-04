<script setup lang="ts">
import { ToastRoot } from 'reka-ui';

import type { ToastProps } from './Toast.types';

defineOptions({ inheritAttrs: false });

const { variant = 'neutral', open } = defineProps<ToastProps>();
</script>

<template>
  <!-- `w-fit`: a short toast should not stretch to the viewport's full cap. -->
  <ToastRoot
    v-bind="$attrs"
    :open="open"
    class="flex w-fit max-w-full flex-col gap-1 rounded-md border bg-bg-elevated py-3 pr-12 pl-4 shadow-xl data-[state=closed]:animate-toast-out data-[state=open]:animate-toast-in data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--reka-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] motion-reduce:animate-none md:pr-9"
    :class="variant === 'error' ? 'border-danger' : 'border-border'"
  >
    <slot />
  </ToastRoot>
</template>
