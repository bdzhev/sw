<script setup lang="ts">
import { DropdownMenuContent as DropdownMenuContentPrimitive } from 'reka-ui';

import type { DropdownMenuContentProps } from './DropdownMenuContent.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownMenuContentProps>(), {
  align: 'start',
  side: 'bottom',
  sideOffset: 4,
});
</script>

<template>
  <DropdownMenuContentPrimitive
    v-bind="$attrs"
    class="z-500 flex min-w-32 flex-col overflow-hidden rounded-sm bg-fg shadow-xl data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in motion-reduce:animate-none"
    :align="props.align"
    :side="props.side"
    :side-offset="props.sideOffset"
    :collision-padding="8"
  >
    <slot />
  </DropdownMenuContentPrimitive>
</template>
