<script setup lang="ts">
import { inject } from 'vue';

import { DROPDOWN_MENU_CTX_KEY } from '../../constants';
import type { DropdownMenuContext } from '../../DropdownMenu.types';

const ctx = inject<DropdownMenuContext>(DROPDOWN_MENU_CTX_KEY)!;

const handleTriggerClick = () => {
  ctx.toggleOpen(!ctx.isOpen.value);
};
</script>

<template>
  <div :ref="ctx?.triggerEl" @click="handleTriggerClick">
    <slot />
  </div>
</template>
