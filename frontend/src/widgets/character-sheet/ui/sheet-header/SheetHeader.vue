<script setup lang="ts">
import { computed } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import type { SheetHeaderProps } from './SheetHeader.types';
import { StatField } from './stat-field';

const props = defineProps<SheetHeaderProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

const subtitle = computed(() => {
  const { race, characterClass } = props.character;

  return `${race} ${characterClass} · level ${props.sheet.level}`;
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
      <StatField
        label="HP"
        :model-value="props.sheet.hpCurrent"
        :max="props.sheet.hpMax || 999"
        @update:model-value="emit('patch', { hpCurrent: $event })"
      />
      <StatField
        label="HP max"
        :model-value="props.sheet.hpMax"
        @update:model-value="emit('patch', { hpMax: $event })"
      />
      <StatField
        label="Temp HP"
        :model-value="props.sheet.tempHp"
        @update:model-value="emit('patch', { tempHp: $event })"
      />
      <StatField
        label="AC"
        :model-value="props.sheet.ac"
        @update:model-value="emit('patch', { ac: $event })"
      />
      <StatField
        label="Speed"
        :model-value="props.sheet.speed"
        @update:model-value="emit('patch', { speed: $event })"
      />
      <StatField label="Level" :model-value="props.sheet.level" readonly />
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
