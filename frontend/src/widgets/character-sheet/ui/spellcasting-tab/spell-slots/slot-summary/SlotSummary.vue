<script setup lang="ts">
import { slotLevelLabel } from '@widgets/character-sheet/lib/spellcasting';

import { SlotPips } from './slot-pips';
import type { SlotSummaryProps } from './SlotSummary.types';

const props = defineProps<SlotSummaryProps>();

/**
 * Real text, visually hidden, rather than an `aria-label` — a label on a plain
 * span is not exposed, and this sits inside the accordion trigger, so it also
 * becomes part of that button's name. A reader gets "2 of 3 remaining" instead
 * of a row of circles.
 */
const rowLabel = (pool: SlotSummaryProps['pools'][number]): string => {
  return `${pool.current} of ${pool.max} remaining`;
};

const spentIn = (pool: SlotSummaryProps['pools'][number]): number => {
  return Math.max(0, pool.max - pool.current);
};

/** A player who typed a current above their max still gets every slot drawn. */
const totalIn = (pool: SlotSummaryProps['pools'][number]): number => {
  return Math.max(pool.max, pool.current);
};
</script>

<template>
  <span v-if="!props.pools.length" class="text-sm text-secondary">
    No slots yet — open to set them.
  </span>

  <span v-else class="flex min-w-0 flex-col gap-1">
    <span
      v-for="pool in props.pools"
      :key="pool.slotLevel"
      class="flex items-center gap-2"
    >
      <span class="w-16 shrink-0 text-xs text-secondary">
        {{ slotLevelLabel(pool.slotLevel) }}
      </span>

      <SlotPips :spent="spentIn(pool)" :total="totalIn(pool)" />

      <span class="sr-only">{{ rowLabel(pool) }}</span>
    </span>
  </span>
</template>
