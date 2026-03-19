<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { inject } from 'vue';

import type { ModalContext } from '../../../../ModalRoot.types';

const ctx = inject<ModalContext>('modalContext');

const handleCloseButtonClick = () => {
  ctx?.toggleModal(false);
};
</script>

<!--prettier-ignore-->
<template>
  <button
    @click="handleCloseButtonClick"
    class="
      cursor-pointer text-secondary
      hover:text-primary
    "
  >
    <X :size="20" />
  </button>
</template>
