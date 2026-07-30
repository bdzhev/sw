<script setup lang="ts">
import { ScrollAreaScrollbar, ScrollAreaThumb } from 'reka-ui';

import type { ScrollBarProps } from './ScrollBar.types';

const props = withDefaults(defineProps<ScrollBarProps>(), {
  orientation: 'vertical',
});

const isVertical = props.orientation === 'vertical';
</script>

<template>
  <ScrollAreaScrollbar
    :orientation="props.orientation"
    :class="{
      'flex touch-none p-px transition-colors duration-200 select-none': true,
      'h-full w-2 border-l border-l-transparent': isVertical,
      'h-2 w-full flex-col border-t border-t-transparent': !isVertical,
    }"
  >
    <ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
  </ScrollAreaScrollbar>
</template>
