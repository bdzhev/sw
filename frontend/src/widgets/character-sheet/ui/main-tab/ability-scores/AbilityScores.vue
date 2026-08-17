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

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

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
  <SheetSection title="Ability scores">
    <ul class="flex flex-col">
      <AbilityScore
        v-for="ability in ABILITIES"
        :key="ability.stat"
        :ability="ability"
        :score="raw[ability.stat]"
        :total="totals[ability.stat]"
        :modifier="abilityModifier(totals[ability.stat])"
        @change="handleScoreChange"
      />
    </ul>
  </SheetSection>
</template>
