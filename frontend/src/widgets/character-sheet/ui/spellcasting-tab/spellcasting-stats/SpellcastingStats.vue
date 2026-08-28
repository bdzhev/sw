<script setup lang="ts">
import { computed } from 'vue';

import { ABILITY_LABELS } from '@entities/characters';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import type { SpellcastingStatsProps } from './SpellcastingStats.types';

const props = defineProps<SpellcastingStatsProps>();

const abilityLabel = computed(() => {
  return props.ability ? ABILITY_LABELS[props.ability] : '—';
});

const saveDcLabel = computed(() => {
  return props.saveDc === null ? '—' : String(props.saveDc);
});

/** An attack bonus is always written signed, +0 included. */
const attackBonusLabel = computed(() => {
  return props.attackBonus === null
    ? '—'
    : `${props.attackBonus >= 0 ? '+' : ''}${props.attackBonus}`;
});

const tiles = computed(() => {
  return [
    { caption: 'Ability', value: abilityLabel.value },
    { caption: 'Save DC', value: saveDcLabel.value },
    { caption: 'Attack bonus', value: attackBonusLabel.value },
  ];
});
</script>

<template>
  <SheetSection title="Spellcasting">
    <!-- Captions sit over values, not over controls, so these are spans and
         not FieldLabels — there is no field for a label to name. -->
    <dl class="grid grid-cols-3 gap-2 md:gap-4">
      <div
        v-for="tile in tiles"
        :key="tile.caption"
        class="flex flex-col items-center gap-1 rounded-md border border-border bg-bg-secondary p-3"
      >
        <dt class="text-xs text-secondary">{{ tile.caption }}</dt>

        <dd class="text-lg font-semibold text-primary">{{ tile.value }}</dd>
      </div>
    </dl>
  </SheetSection>
</template>
