<script setup lang="ts">
import { inject } from 'vue';

import type { ModalContext } from '../../ModalRoot.types';

const ctx = inject<ModalContext>('modalContext');

const handleTriggerClick = () => {
  ctx?.toggleModal(true);
};
</script>

<template>
  <div @click="handleTriggerClick">
    <slot />
  </div>
</template>
