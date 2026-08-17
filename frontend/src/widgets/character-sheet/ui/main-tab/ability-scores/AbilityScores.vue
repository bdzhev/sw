<script setup lang="ts">
import { computed } from 'vue';

import type { SheetPatch } from '@shared/api/characters';

import {
  ABILITIES,
  abilityModifier,
  abilityScores,
  totalAbilityScores,
  type AbilitySheetField,
} from '@entities/characters';

import { AbilityScore } from './ability-score';
import type { AbilityScoresProps } from './AbilityScores.types';

const props = defineProps<AbilityScoresProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

const raw = computed(() => {
  return abilityScores(props.sheet);
});

const totals = computed(() => {
  return totalAbilityScores(props.sheet, props.items);
});

/**
 * Typing a score is a repeated edit, so it rides the debounce.
 */
const handleScoreChange = (field: AbilitySheetField, score: number): void => {
  const patch: Partial<Record<AbilitySheetField, number>> = { [field]: score };

  emit('patch', patch);
};
</script>

<template>
  <section
    class="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
  >
    <h2 class="text-sm font-semibold text-primary uppercase">Ability scores</h2>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <AbilityScore
        v-for="ability in ABILITIES"
        :key="ability.stat"
        :ability="ability"
        :score="raw[ability.stat]"
        :total="totals[ability.stat]"
        :modifier="abilityModifier(totals[ability.stat])"
        @change="handleScoreChange"
      />
    </div>
  </section>
</template>
