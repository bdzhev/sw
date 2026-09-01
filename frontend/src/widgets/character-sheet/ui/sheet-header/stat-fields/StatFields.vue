<script setup lang="ts">
import { Footprints, Heart, HeartPlus, HeartPulse, Shield } from 'lucide-vue-next';
import { computed, type WritableComputedRef } from 'vue';

import type { SheetPatch } from '@shared/api/characters';

import { StatField } from './stat-field';
import type { SheetStatField, StatFieldsProps } from './StatFields.types';

const MAX_STAT = 999;

/** Matched to the label's `text-xs`, so the glyph sits on the cap height. */
const ICON_SIZE = 12;

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
  <div class="grid w-full grid-cols-5 gap-1 md:w-fit md:shrink-0 md:gap-2">
    <StatField v-model="hpCurrent" label="HP" :max="hpCeiling" class="md:w-20">
      <template #icon>
        <HeartPulse :size="ICON_SIZE" aria-hidden="true" />
      </template>
    </StatField>

    <StatField v-model="hpMax" label="Max HP" class="md:w-20">
      <template #icon>
        <Heart :size="ICON_SIZE" aria-hidden="true" />
      </template>
    </StatField>

    <StatField v-model="tempHp" label="Temp" class="md:w-20">
      <template #icon>
        <HeartPlus :size="ICON_SIZE" aria-hidden="true" />
      </template>
    </StatField>

    <StatField v-model="ac" label="AC" class="md:w-20">
      <template #icon>
        <Shield :size="ICON_SIZE" aria-hidden="true" />
      </template>
    </StatField>

    <StatField v-model="speed" label="Speed" class="md:w-20">
      <template #icon>
        <Footprints :size="ICON_SIZE" aria-hidden="true" />
      </template>
    </StatField>
  </div>
</template>
