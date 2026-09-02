<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { computed } from 'vue';

import type { ProgressProps } from './Progress.types';

const props = withDefaults(defineProps<ProgressProps>(), { max: 100 });

/**
 * The indicator is sized by `width`, not a transform: in Tailwind v4 the
 * `translate-*` utilities own the `translate` property, and animating
 * `transform` on top of one stacks instead of overriding it.
 */
const indicatorStyle = computed(() => {
  if (props.max <= 0) {
    return { width: '0%' };
  }

  const ratio = Math.min(Math.max(props.value / props.max, 0), 1);

  return { width: `${ratio * 100}%` };
});
</script>

<template>
  <ProgressRoot
    :model-value="props.value"
    :max="props.max"
    class="h-1 w-full overflow-hidden bg-border"
  >
    <ProgressIndicator
      class="h-full bg-accent-primary transition-[width] duration-300 ease-out motion-reduce:transition-none"
      :style="indicatorStyle"
    />
  </ProgressRoot>
</template>
