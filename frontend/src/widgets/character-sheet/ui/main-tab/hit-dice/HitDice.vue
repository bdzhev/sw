<script setup lang="ts">
import { computed } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { NumberField } from '@shared/ui/number-field';
import { Text } from '@shared/ui/text';

import { HIT_DIE_BY_CLASS } from '@entities/characters';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import type { HitDiceProps } from './HitDice.types';

const MIN_REMAINING = 0;

const props = defineProps<HitDiceProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

const dieSize = computed(() => {
  return HIT_DIE_BY_CLASS[props.characterClass];
});

/** A counter, so the debounced absolute write is self-healing on repeat taps. */
const remaining = computed({
  get: (): number => {
    return props.hitDiceRemaining;
  },
  set: (value: number): void => {
    emit('patch', { hitDiceRemaining: value });
  },
});
</script>

<template>
  <SheetSection title="Hit dice" variant="plain" :heading-level="3">
    <template #actions>
      <Text size="xs" theme="secondary">d{{ dieSize }} · {{ props.level }} total</Text>
    </template>

    <NumberField
      v-model="remaining"
      label="Remaining"
      has-stepper
      :min="MIN_REMAINING"
      :max="props.level"
      decrement-label="Spend a hit die"
      increment-label="Regain a hit die"
    />
  </SheetSection>
</template>
