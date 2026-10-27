<script setup lang="ts">
import type { SheetPatch } from '@shared/api/characters';

import { ABILITIES, abilityModifier, type AbilitySheetField } from '@entities/characters';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { AbilityScore } from './ability-score';
import type { AbilityScoresProps } from './AbilityScores.types';

const props = defineProps<AbilityScoresProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

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
        :score="props.rawScores[ability.stat]"
        :total="props.totals[ability.stat]"
        :modifier="abilityModifier(props.totals[ability.stat])"
        @change="handleScoreChange"
      />
    </ul>
  </SheetSection>
</template>
