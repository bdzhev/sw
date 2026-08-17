<script setup lang="ts">
import { computed } from 'vue';

import { CharacterStat } from '@shared/api/characters';
import { NumberField } from '@shared/ui/number-field';

import {
  abilityModifier,
  initiativeTotal,
  totalAbilityScores,
} from '@entities/characters';

import { INITIATIVE_BONUS_LIMIT } from '@widgets/character-sheet/config/combat';
import { formatSigned } from '@widgets/character-sheet/lib/format';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import type { InitiativePanelProps } from './InitiativePanel.types';

const HINT =
  'Feats and features that add to initiative — Alert and friends — go in the misc bonus.';

const props = defineProps<InitiativePanelProps>();

const emit = defineEmits<{ 'update:bonus': [value: number] }>();

const total = computed(() => {
  return initiativeTotal(props.sheet, props.items);
});

const dexModifier = computed(() => {
  return abilityModifier(totalAbilityScores(props.sheet, props.items)[CharacterStat.DEX]);
});

const bonus = computed({
  get: (): number => {
    return props.sheet.initiativeBonus;
  },
  set: (value: number): void => {
    emit('update:bonus', value);
  },
});
</script>

<template>
  <SheetSection title="Initiative" :description="HINT">
    <div class="grid grid-cols-3 items-start gap-3">
      <div class="flex min-w-0 flex-col gap-1">
        <span class="truncate text-xs text-secondary uppercase">Total</span>

        <p
          class="flex min-h-11 items-center text-3xl font-semibold text-accent-primary tabular-nums md:min-h-9"
        >
          {{ formatSigned(total) }}
        </p>
      </div>

      <div class="flex min-w-0 flex-col gap-1">
        <span class="truncate text-xs text-secondary uppercase">Dex mod</span>

        <p
          class="flex min-h-11 items-center text-3xl font-semibold text-secondary tabular-nums md:min-h-9"
        >
          {{ formatSigned(dexModifier) }}
        </p>
      </div>

      <NumberField
        v-model="bonus"
        label="Misc bonus"
        :min="-INITIATIVE_BONUS_LIMIT"
        :max="INITIATIVE_BONUS_LIMIT"
      />
    </div>
  </SheetSection>
</template>
