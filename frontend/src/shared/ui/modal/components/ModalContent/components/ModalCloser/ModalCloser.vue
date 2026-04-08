<script setup lang="ts">
import { inject } from 'vue';

import type { ModalContext } from '../../../../ModalRoot.types';

const ctx = inject<ModalContext>('modalContext');

const handleClose = () => {
  ctx?.toggleModal(false);
};
</script>

<template>
  <slot :close="handleClose" />
</template>
