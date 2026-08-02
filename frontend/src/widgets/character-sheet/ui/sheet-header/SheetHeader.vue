<script setup lang="ts">
import { computed, type WritableComputedRef } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import type { SheetHeaderProps, SheetStatField } from './SheetHeader.types';
import { StatField } from './stat-field';

const MAX_STAT = 999;

const props = defineProps<SheetHeaderProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

const subtitle = computed(() => {
  const { race, characterClass } = props.character;

  return `${race} ${characterClass} · level ${props.sheet.level}`;
});

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

const level = computed(() => {
  return props.sheet.level;
});

/** Current HP cannot exceed a maximum that has not been entered yet. */
const hpCeiling = computed(() => {
  return props.sheet.hpMax || MAX_STAT;
});
</script>

<template>
  <header
    class="flex flex-col gap-4 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
  >
    <div class="flex flex-col gap-1">
      <h1 class="truncate text-2xl font-semibold text-primary">
        {{ props.character.name }}
      </h1>

      <Text size="sm" theme="secondary" class="capitalize">{{ subtitle }}</Text>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <StatField v-model="hpCurrent" label="HP" :max="hpCeiling" />

      <StatField v-model="hpMax" label="HP max" />

      <StatField v-model="tempHp" label="Temp HP" />

      <StatField v-model="ac" label="AC" />

      <StatField v-model="speed" label="Speed" />

      <StatField :model-value="level" label="Level" is-readonly />
    </div>

    <div v-if="props.sheet.conditions.length" class="flex flex-wrap items-center gap-2">
      <span
        v-for="condition in props.sheet.conditions"
        :key="condition"
        class="rounded-full bg-warning/20 px-3 py-1 text-xs text-warning"
      >
        {{ condition }}
      </span>
    </div>
  </header>
</template>
