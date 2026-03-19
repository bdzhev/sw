<script setup lang="ts">
import { inject } from 'vue';

import { DROPDOWN_MENU_CTX_KEY } from '../../constants';
import type { DropdownMenuContext } from '../../DropdownMenu.types';

const ctx = inject<DropdownMenuContext>(DROPDOWN_MENU_CTX_KEY)!;
</script>

<template>
  <Teleport :to="ctx.portalTo" v-if="ctx.isOpen.value">
    <slot />
  </Teleport>
</template>
