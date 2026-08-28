<script setup lang="ts">
import { computed } from 'vue';

import { NumberField } from '@shared/ui/number-field';

import { MAX_SLOT_COUNT } from '@widgets/character-sheet/config/spellcasting';
import { slotLevelLabel } from '@widgets/character-sheet/lib/spellcasting';

import type { SlotRowProps } from './SlotRow.types';

const props = defineProps<SlotRowProps>();

/** The row knows its own slot level, so the grid never has to work out which fired. */
const emit = defineEmits<{
  changeCurrent: [slotLevel: number, value: number];
  changeMax: [slotLevel: number, value: number];
}>();

const label = computed(() => {
  return slotLevelLabel(props.slotLevel);
});

/**
 * `current` is not clamped to `max`. The two are typed independently and a
 * player mid-edit — raising max after spending, or writing an item's bonus slot
 * in — should not have their number silently rewritten.
 */
const currentValue = computed<number | undefined>({
  get: () => {
    return props.current;
  },
  set: (next) => {
    // reka hands back `undefined` for an empty box; an empty slot box means zero.
    emit('changeCurrent', props.slotLevel, next ?? 0);
  },
});

const maxValue = computed<number | undefined>({
  get: () => {
    return props.max;
  },
  set: (next) => {
    emit('changeMax', props.slotLevel, next ?? 0);
  },
});
</script>

<template>
  <li
    class="flex flex-col gap-2 rounded-md border border-border bg-bg-secondary p-3 sm:flex-row sm:items-center sm:justify-between"
  >
    <span class="text-sm font-medium text-primary">{{ label }}</span>

    <!--
      Both fields carry a hard width. `w-auto` is a no-op, and without a cap the
      input's `w-full` resolves against a content-derived parent and falls back
      to the `<input>`'s intrinsic size — about 200px each, which overflowed a
      phone. `w-40` matches the combat tab's ammo field, the other stepper that
      shares a row.
    -->
    <div class="flex min-w-0 items-center gap-2">
      <NumberField
        v-model="currentValue"
        :label="`${label} slots remaining`"
        :is-label-hidden="true"
        :min="0"
        :max="MAX_SLOT_COUNT"
        :has-stepper="true"
        :decrement-label="`Spend a ${label.toLowerCase()} slot`"
        :increment-label="`Restore a ${label.toLowerCase()} slot`"
        class="w-40"
      />

      <span class="shrink-0 text-xs text-secondary uppercase">max</span>

      <NumberField
        v-model="maxValue"
        :label="`${label} maximum`"
        :is-label-hidden="true"
        :min="0"
        :max="MAX_SLOT_COUNT"
        class="w-20"
      />
    </div>
  </li>
</template>
