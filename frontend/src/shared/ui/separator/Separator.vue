<script setup lang="ts">
import { Separator as SeparatorRoot } from 'reka-ui';
import { computed } from 'vue';

import type { SeparatorProps } from './Separator.types';

const props = withDefaults(defineProps<SeparatorProps>(), {
  orientation: 'horizontal',
  isDecorative: false,
});

/**
 * A 1px box in one axis and full-bleed in the other. `shrink-0` matters in a
 * flex row: without it the rule is the first thing flexbox squeezes to nothing.
 */
const sizeClasses = computed(() => {
  return props.orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full';
});
</script>

<template>
  <SeparatorRoot
    :orientation="props.orientation"
    :decorative="props.isDecorative"
    :class="['shrink-0 bg-border', sizeClasses]"
  />
</template>
