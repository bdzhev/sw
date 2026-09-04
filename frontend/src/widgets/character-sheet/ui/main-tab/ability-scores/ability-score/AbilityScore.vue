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
  <li
    class="flex items-center gap-3 border-t border-border py-2 first:border-t-0 first:pt-0"
  >
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="text-xs text-secondary uppercase">{{ props.ability.abbr }}</span>

      <span v-if="hasItemBonus" class="text-xxs text-secondary">
        {{ props.total }} with gear
      </span>
    </div>

    <NumberField
      v-model="score"
      :label="props.ability.name"
      is-label-hidden
      :min="MIN_ABILITY_SCORE"
      :max="MAX_ABILITY_SCORE"
      class="w-16 shrink-0"
    />

    <output
      class="w-10 shrink-0 text-right text-lg font-semibold text-accent-primary tabular-nums"
    >
      {{ formatSigned(props.modifier) }}
      <span class="sr-only">{{ props.ability.name }} modifier</span>
    </output>
  </li>
</template>
