<script setup lang="ts">
import { NumberField } from '@shared/ui/number-field';

import type { StatFieldProps } from './StatField.types';

const props = withDefaults(defineProps<StatFieldProps>(), {
  isReadonly: false,
  min: 0,
  max: 999,
});

/**
 * Clamping and the empty box belong to the primitive. The hand-rolled version
 * read a cleared input as 0 and clamped to `min`, so wiping the HP box to retype
 * it wrote 0 HP first.
 */
const value = defineModel<number>({ required: true });
</script>

<template>
  <div v-if="props.isReadonly" class="flex min-w-0 flex-col gap-1">
    <span class="truncate text-xs text-secondary uppercase">{{ props.label }}</span>

    <p class="text-base font-semibold text-primary tabular-nums">{{ value }}</p>
  </div>

  <!--
    Always `sm`: five of these share one line at phone width, and matching the
    desktop row to it keeps the header reading as chrome rather than as the
    loudest thing on the sheet.
  -->
  <NumberField
    v-else
    v-model="value"
    size="sm"
    :label="props.label"
    :min="props.min"
    :max="props.max"
  />
</template>
