<script setup lang="ts">
import { computed, type WritableComputedRef } from 'vue';

import type { SheetPatch } from '@shared/api/characters';

import { StatField } from './stat-field';
import type { SheetStatField, StatFieldsProps } from './StatFields.types';

const MAX_STAT = 999;

const props = defineProps<StatFieldsProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

/** One writable per field, so each `StatField` is a plain `v-model`. */
const statModel = (field: SheetStatField): WritableComputedRef<number> => {
  return computed({
    get: (): number => {
      return props.sheet[field];
    },
    set: (value: number): void => {
      emit('patch', { [field]: value });
    },
  });
};

const hpCurrent = statModel('hpCurrent');
const hpMax = statModel('hpMax');
const tempHp = statModel('tempHp');
const ac = statModel('ac');
const speed = statModel('speed');

/** Current HP cannot exceed a maximum that has not been entered yet. */
const hpCeiling = computed(() => {
  return props.sheet.hpMax || MAX_STAT;
});
</script>

<template>
  <!--
    One row at every width. Below md the grid is `w-full` so the five 1fr tracks
    divide the line between them — `w-fit` (which is what it needs from md up, to
    sit beside the name rather than eat the row) sizes to content instead, which
    is why the fields carry no width of their own until then.

    md rather than sm: five 80px boxes plus the equipment button come to ~480px,
    which at sm would leave the character's name about 50px to truncate into.
  -->
  <div class="grid w-full grid-cols-5 gap-1 md:w-fit md:shrink-0 md:gap-2">
    <StatField v-model="hpCurrent" label="HP" :max="hpCeiling" class="md:w-20" />

    <StatField v-model="hpMax" label="Max" class="md:w-20" />

    <StatField v-model="tempHp" label="Temp" class="md:w-20" />

    <StatField v-model="ac" label="AC" class="md:w-20" />

    <StatField v-model="speed" label="Speed" class="md:w-20" />
  </div>
</template>
