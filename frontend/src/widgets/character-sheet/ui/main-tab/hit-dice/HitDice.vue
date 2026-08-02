<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next';
import { computed } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import { HIT_DIE_BY_CLASS, hitDiceTotal } from '@entities/characters';

import { clamp, readNumberInput } from '@widgets/character-sheet/lib/main/formatters';

import type { HitDiceProps } from './HitDice.types';

const INPUT_ID = 'hit-dice-remaining';
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

const remaining = computed(() => {
  return props.sheet.hitDiceRemaining;
});

/** A counter, so the debounced absolute write is self-healing on repeat taps. */
const setRemaining = (value: number) => {
  emit('patch', { hitDiceRemaining: clamp(value, MIN_REMAINING, total.value) });
};

const onInput = (event: Event) => {
  setRemaining(readNumberInput(event, remaining.value));
};
</script>

<template>
  <section
    class="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
  >
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <h2 class="text-sm font-semibold text-primary uppercase">Hit dice</h2>

      <Text size="xs" theme="secondary">d{{ dieSize }} · {{ total }} total</Text>
    </div>

    <label :for="INPUT_ID" class="text-xs text-secondary uppercase">Remaining</label>

    <div class="flex items-center gap-2">
      <button
        type="button"
        aria-label="Spend a hit die"
        :disabled="remaining <= MIN_REMAINING"
        class="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-primary transition-colors enabled:hover:border-accent-primary disabled:text-secondary"
        @click="setRemaining(remaining - 1)"
      >
        <Minus :size="18" />
      </button>

      <input
        :id="INPUT_ID"
        type="number"
        inputmode="numeric"
        :value="remaining"
        :min="MIN_REMAINING"
        :max="total"
        class="min-h-11 w-full min-w-0 rounded-md border border-border bg-bg-primary px-2 text-center text-xl font-semibold text-primary tabular-nums outline-none focus:border-accent-primary"
        @input="onInput"
      />

      <button
        type="button"
        aria-label="Regain a hit die"
        :disabled="remaining >= total"
        class="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-primary transition-colors enabled:hover:border-accent-primary disabled:text-secondary"
        @click="setRemaining(remaining + 1)"
      >
        <Plus :size="18" />
      </button>
    </div>
  </section>
</template>
