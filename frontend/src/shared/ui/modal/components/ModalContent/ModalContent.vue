<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { inject, onMounted, ref } from 'vue';

import type { ModalContext } from '../../ModalRoot.types';

const ctx = inject<ModalContext>('modalContext')!;

const modalContentRef = ref<HTMLElement | null>(null);

onClickOutside(modalContentRef, () => {
  if (ctx.shouldCloseOnOutsideClick) {
    ctx.toggleModal(false);
  }
});

onMounted(() => {
  ctx.onModalOpen?.();
});
</script>

<template>
  <div class="
    relative flex min-h-30 min-w-100 flex-col rounded-md bg-bg-secondary/50
    backdrop-blur-3xl
  " ref="modalContentRef">
    <slot />
  </div>
</template>
