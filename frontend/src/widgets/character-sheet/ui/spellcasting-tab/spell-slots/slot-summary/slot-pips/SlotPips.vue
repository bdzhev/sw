<script setup lang="ts">
import { Circle } from 'lucide-vue-next';
import { computed } from 'vue';

import { MAX_PIP_COUNT } from '@widgets/character-sheet/config/spellcasting';

import type { SlotPipsProps } from './SlotPips.types';

const PIP_SIZE = 14;

const props = defineProps<SlotPipsProps>();

/**
 * Filled = spent, empty = still yours. That is the paper-sheet convention — you
 * tick the box when you burn the slot — and it is why the spent ones are muted
 * and the remaining ones carry the accent: the bright circles are what you can
 * still cast.
 */
const pips = computed(() => {
  return Array.from({ length: props.total }, (_, index) => {
    return { key: index, isSpent: index < props.spent };
  });
});

/** A pool nobody could count at a glance is a number, not a row of circles. */
const isCountOnly = computed(() => {
  return props.total > MAX_PIP_COUNT;
});

const remaining = computed(() => {
  return Math.max(0, props.total - props.spent);
});
</script>

<template>
  <!-- Both branches are decorative: the row states the count in text for a reader. -->
  <span v-if="isCountOnly" class="text-xs text-secondary tabular-nums" aria-hidden="true">
    {{ remaining }} of {{ props.total }} left
  </span>

  <span v-else class="flex flex-wrap items-center gap-1" aria-hidden="true">
    <Circle
      v-for="pip in pips"
      :key="pip.key"
      :size="PIP_SIZE"
      :fill="pip.isSpent ? 'currentColor' : 'none'"
      :class="pip.isSpent ? 'text-secondary' : 'text-accent-primary'"
    />
  </span>
</template>
