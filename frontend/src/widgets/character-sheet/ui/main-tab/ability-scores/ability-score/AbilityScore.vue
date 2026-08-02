<script setup lang="ts">
import { computed } from 'vue';

import {
  MAX_ABILITY_SCORE,
  MIN_ABILITY_SCORE,
} from '@widgets/character-sheet/config/main/constants';
import {
  clamp,
  formatModifier,
  readNumberInput,
} from '@widgets/character-sheet/lib/main/formatters';

import type { AbilityScoreProps } from './AbilityScore.types';

const props = defineProps<AbilityScoreProps>();

const emit = defineEmits<{ 'update:score': [value: number] }>();

const inputId = computed(() => {
  return `ability-${props.abbr}`;
});

const hasItemBonus = computed(() => {
  return props.total !== props.score;
});

const onInput = (event: Event) => {
  const next = readNumberInput(event, props.score);

  emit('update:score', clamp(next, MIN_ABILITY_SCORE, MAX_ABILITY_SCORE));
};
</script>

<template>
  <div class="flex min-w-0 flex-col gap-2 rounded-md border border-border p-3">
    <div class="flex min-w-0 items-baseline justify-between gap-2">
      <label :for="inputId" class="truncate text-xs text-secondary uppercase">
        {{ props.abbr }}
        <span class="sr-only">{{ props.name }}</span>
      </label>

      <output
        :for="inputId"
        class="shrink-0 text-lg font-semibold text-accent-primary tabular-nums"
      >
        {{ formatModifier(props.modifier) }}
        <span class="sr-only">{{ props.name }} modifier</span>
      </output>
    </div>

    <input
      :id="inputId"
      type="number"
      inputmode="numeric"
      :value="props.score"
      :min="MIN_ABILITY_SCORE"
      :max="MAX_ABILITY_SCORE"
      class="min-h-11 w-full min-w-0 rounded-md border border-border bg-bg-primary px-2 text-center text-xl font-semibold text-primary tabular-nums outline-none focus:border-accent-primary"
      @input="onInput"
    />

    <p v-if="hasItemBonus" class="text-xs text-secondary">
      {{ props.total }} with equipped gear
    </p>
  </div>
</template>
