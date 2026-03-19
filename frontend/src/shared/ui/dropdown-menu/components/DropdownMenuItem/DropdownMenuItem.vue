<script setup lang="ts">
import { inject } from 'vue';

import { DROPDOWN_MENU_CTX_KEY } from '../../constants';
import type { DropdownMenuContext } from '../../DropdownMenu.types';

import type { DropdownMenuItemProps } from './DropdownMenuItem.props';

const props = defineProps<DropdownMenuItemProps>();

const ctx = inject<DropdownMenuContext>(DROPDOWN_MENU_CTX_KEY)!;

const handleClick = () => {
  props?.onClick?.();
  ctx.toggleOpen(false);
};
</script>

<!--prettier-ignore-->
<template>
  <div
    @click="handleClick"
    class="
      flex cursor-pointer flex-row items-center gap-2 px-4 py-2 transition-all
      hover:bg-bg-primary/20 hover:text-accent-primary
    "
  >
    <slot />
  </div>
</template>
