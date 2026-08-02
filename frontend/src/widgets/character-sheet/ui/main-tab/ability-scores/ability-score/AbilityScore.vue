<script setup lang="ts">
import { computed } from 'vue';

import { NumberField } from '@shared/ui/number-field';

import type { AbilitySheetField } from '@entities/characters';

import {
  MAX_ABILITY_SCORE,
  MIN_ABILITY_SCORE,
} from '@widgets/character-sheet/config/main';
import { formatSigned } from '@widgets/character-sheet/lib/format';

import type { AbilityScoreProps } from './AbilityScore.types';

const props = defineProps<AbilityScoreProps>();

const emit = defineEmits<{ change: [field: AbilitySheetField, score: number] }>();

const hasItemBonus = computed(() => {
  return props.total !== props.score;
});

const score = computed({
  get: (): number => {
    return props.score;
  },
  set: (value: number): void => {
    emit('change', props.ability.field, value);
  },
});
</script>

<template>
  <div class="flex min-w-0 flex-col gap-2 rounded-md border border-border p-3">
    <div class="flex min-w-0 items-baseline justify-between gap-2">
      <span class="truncate text-xs text-secondary uppercase">
        {{ props.ability.abbr }}
      </span>

      <output class="shrink-0 text-lg font-semibold text-accent-primary tabular-nums">
        {{ formatSigned(props.modifier) }}
        <span class="sr-only">{{ props.ability.name }} modifier</span>
      </output>
    </div>

    <NumberField
      v-model="score"
      :label="props.ability.name"
      is-label-hidden
      :min="MIN_ABILITY_SCORE"
      :max="MAX_ABILITY_SCORE"
    />

    <p v-if="hasItemBonus" class="text-xs text-secondary">
      {{ props.total }} with equipped gear
    </p>
  </div>
</template>
