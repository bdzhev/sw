<script setup lang="ts">
import { TooltipContent as TooltipContentPrimitive } from 'reka-ui';

defineOptions({ inheritAttrs: false });

const DEFAULT_SIDE_OFFSET = 8;
</script>

<template>
  <TooltipContentPrimitive
    :side-offset="DEFAULT_SIDE_OFFSET"
    v-bind="$attrs"
    class="z-1100 rounded-sm bg-accent-secondary px-3 py-1.5 text-sm text-primary shadow-xl data-[state=closed]:animate-overlay-out data-[state=delayed-open]:animate-overlay-in data-[state=instant-open]:animate-overlay-in motion-reduce:animate-none"
  >
    <slot />
  </TooltipContentPrimitive>
</template>
