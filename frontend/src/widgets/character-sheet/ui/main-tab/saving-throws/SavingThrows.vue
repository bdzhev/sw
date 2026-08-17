<script setup lang="ts">
import { computed } from 'vue';

import type { CharacterStat, SheetPatch } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import { ABILITIES, proficiencyBonus, savingThrowTotal } from '@entities/characters';

import { formatSigned } from '@widgets/character-sheet/lib/format';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { SavingThrowRow } from './saving-throw-row';
import type { SavingThrowsProps } from './SavingThrows.types';

const props = defineProps<SavingThrowsProps>();

const emit = defineEmits<{ patch: [patch: SheetPatch, immediate?: boolean] }>();

const bonus = computed(() => {
  return proficiencyBonus(props.sheet);
});

const isProficient = (stat: CharacterStat): boolean => {
  return props.sheet.saveProficiencies.includes(stat);
};

/** Single-shot edit, so it skips the debounce and writes the whole new set. */
const handleToggleProficiency = (stat: CharacterStat): void => {
  const saveProficiencies = isProficient(stat)
    ? props.sheet.saveProficiencies.filter((entry) => {
        return entry !== stat;
      })
    : [...props.sheet.saveProficiencies, stat];

  emit('patch', { saveProficiencies }, true);
};
</script>

<template>
  <SheetSection title="Saving throws">
    <template #actions>
      <Text size="xs" theme="secondary">
        Proficiency {{ formatSigned(bonus) }} · level {{ props.sheet.level }}
      </Text>
    </template>

    <table class="w-full text-left">
      <thead>
        <tr class="text-xs text-secondary uppercase">
          <th scope="col" class="w-11 pb-2 text-center font-normal">Prof</th>
          <th scope="col" class="pr-3 pb-2 font-normal">Save</th>
          <th scope="col" class="pb-2 text-right font-normal">Total</th>
        </tr>
      </thead>

      <tbody>
        <SavingThrowRow
          v-for="ability in ABILITIES"
          :key="ability.stat"
          :ability="ability"
          :is-proficient="isProficient(ability.stat)"
          :total="savingThrowTotal(props.sheet, ability.stat, props.items)"
          @toggle="handleToggleProficiency"
        />
      </tbody>
    </table>
  </SheetSection>
</template>
