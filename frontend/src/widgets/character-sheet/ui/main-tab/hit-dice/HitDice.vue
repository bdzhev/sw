<script setup lang="ts">
import { computed } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { NumberField } from '@shared/ui/number-field';
import { Text } from '@shared/ui/text';

import { HIT_DIE_BY_CLASS, hitDiceTotal } from '@entities/characters';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import type { HitDiceProps } from './HitDice.types';

const MIN_REMAINING = 0;

const props = defineProps<HitDiceProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

const dieSize = computed(() => {
  return HIT_DIE_BY_CLASS[props.characterClass];
});

/** No multiclassing, so the total is always the level. */
const total = computed(() => {
  return hitDiceTotal(props.sheet);
});

/** A counter, so the debounced absolute write is self-healing on repeat taps. */
const remaining = computed({
  get: (): number => {
    return props.sheet.hitDiceRemaining;
  },
  set: (value: number): void => {
    emit('patch', { hitDiceRemaining: value });
  },
});
</script>

<template>
  <SheetSection title="Hit dice" variant="plain" :heading-level="3">
    <template #actions>
      <Text size="xs" theme="secondary">d{{ dieSize }} · {{ total }} total</Text>
    </template>

    <NumberField
      v-model="remaining"
      label="Remaining"
      has-stepper
      :min="MIN_REMAINING"
      :max="total"
      decrement-label="Spend a hit die"
      increment-label="Regain a hit die"
    />
  </SheetSection>
</template>
