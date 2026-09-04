<script setup lang="ts">
import { Coins } from 'lucide-vue-next';
import { computed, type WritableComputedRef } from 'vue';

import type { SheetPatch } from '@shared/api/characters';
import { NumberField } from '@shared/ui/number-field';

import { CURRENCY_LIMIT } from '@widgets/character-sheet/config/equipment';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import type {
  CoinDescriptor,
  CurrencyField,
  CurrencyFieldsProps,
} from './CurrencyFields.types';

const COINS: readonly CoinDescriptor[] = [
  { field: 'gp', abbr: 'GP', label: 'Gold pieces', colorClass: 'text-coin-gold' },
  { field: 'sp', abbr: 'SP', label: 'Silver pieces', colorClass: 'text-coin-silver' },
  { field: 'cp', abbr: 'CP', label: 'Copper pieces', colorClass: 'text-coin-copper' },
];

const props = defineProps<CurrencyFieldsProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

/**
 * Presentational half, not `FormNumberField`: per rules.md §4 the autosaving
 * sheet has no form, so every inline field on it is the plain primitive with a
 * writable computed. Typing is a repeated edit, so it rides the debounce.
 */
const currencyModel = (field: CurrencyField): WritableComputedRef<number> => {
  return computed({
    get: (): number => {
      return props[field];
    },
    set: (value: number): void => {
      emit('patch', { [field]: value });
    },
  });
};

const models = computed(() => {
  return COINS.map((coin) => {
    return { coin, model: currencyModel(coin.field) };
  });
});
</script>

<template>
  <SheetSection title="Currency" description="Platinum and electrum are left out.">
    <div class="grid grid-cols-3 gap-2 md:gap-4">
      <!--
        The caption is our own span rather than the field's label, because the
        label's colour is baked into FIELD_LABEL_CLASSES and a consumer class
        cannot beat it — same specificity, stylesheet order decides. So the real
        label is kept for the accessible name and hidden, and the coloured
        caption sits above the box. AbilityScore does the same thing.
      -->
      <div
        v-for="entry in models"
        :key="entry.coin.field"
        class="flex min-w-0 flex-col gap-1"
      >
        <span
          :class="['flex items-center gap-1 text-xs uppercase', entry.coin.colorClass]"
        >
          <Coins :size="14" aria-hidden="true" />

          {{ entry.coin.abbr }}
        </span>

        <NumberField
          v-model="entry.model.value"
          size="sm"
          :label="entry.coin.label"
          is-label-hidden
          :max="CURRENCY_LIMIT"
        />
      </div>
    </div>
  </SheetSection>
</template>
