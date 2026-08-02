<script setup lang="ts">
import { computed } from 'vue';

import { CharacterStat } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import {
  abilityModifier,
  initiativeTotal,
  totalAbilityScores,
} from '@entities/characters';

import { INITIATIVE_BONUS_LIMIT } from '@widgets/character-sheet/config/combat/constants';
import { formatSigned } from '@widgets/character-sheet/lib/combat/attack-math';

import type { InitiativePanelProps } from './InitiativePanel.types';

const props = defineProps<InitiativePanelProps>();

const emit = defineEmits<{ 'update:bonus': [value: number] }>();

const total = computed(() => {
  return initiativeTotal(props.sheet, props.items);
});

const dexModifier = computed(() => {
  return abilityModifier(totalAbilityScores(props.sheet, props.items)[CharacterStat.DEX]);
});

const onBonusInput = (event: Event) => {
  const parsed = Number((event.target as HTMLInputElement).value);
  const bonus = Number.isFinite(parsed) ? parsed : 0;

  emit(
    'update:bonus',
    Math.min(INITIATIVE_BONUS_LIMIT, Math.max(-INITIATIVE_BONUS_LIMIT, bonus)),
  );
};
</script>

<template>
  <section
    class="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
  >
    <h2 class="text-xs text-secondary uppercase">Initiative</h2>

    <div class="grid grid-cols-2 items-end gap-3 sm:grid-cols-3">
      <div class="flex min-w-0 flex-col gap-1">
        <span class="text-xs text-secondary">Total</span>

        <p class="text-3xl font-semibold text-accent-primary tabular-nums">
          {{ formatSigned(total) }}
        </p>
      </div>

      <div class="flex min-w-0 flex-col gap-1">
        <span class="text-xs text-secondary">Dex modifier</span>

        <p class="text-xl font-semibold text-primary tabular-nums">
          {{ formatSigned(dexModifier) }}
        </p>
      </div>

      <label class="col-span-2 flex min-w-0 flex-col gap-1 sm:col-span-1">
        <span class="text-xs text-secondary">Misc bonus</span>

        <input
          type="number"
          inputmode="numeric"
          :value="props.sheet.initiativeBonus"
          :min="-INITIATIVE_BONUS_LIMIT"
          :max="INITIATIVE_BONUS_LIMIT"
          class="min-h-11 w-full rounded-md border border-border bg-bg-primary px-3 text-xl font-semibold text-primary tabular-nums outline-none focus:border-accent-primary md:min-h-0 md:py-1"
          @input="onBonusInput"
        />
      </label>
    </div>

    <Text size="xs" theme="secondary">
      Feats and features that add to initiative — Alert and friends — go in the misc
      bonus.
    </Text>
  </section>
</template>
