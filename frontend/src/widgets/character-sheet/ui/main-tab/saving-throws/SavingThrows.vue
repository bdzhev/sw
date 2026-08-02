<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { computed } from 'vue';

import type { CharacterStat, SheetPatch } from '@shared/api/characters';
import { Text } from '@shared/ui/text';

import { ABILITIES, proficiencyBonus, savingThrowTotal } from '@entities/characters';

import { formatModifier } from '@widgets/character-sheet/lib/main/formatters';

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
const toggleProficiency = (stat: CharacterStat) => {
  const saveProficiencies = isProficient(stat)
    ? props.sheet.saveProficiencies.filter((entry) => {
        return entry !== stat;
      })
    : [...props.sheet.saveProficiencies, stat];

  emit('patch', { saveProficiencies }, true);
};
</script>

<template>
  <section
    class="flex flex-col gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6"
  >
    <div class="flex flex-wrap items-baseline justify-between gap-2">
      <h2 class="text-sm font-semibold text-primary uppercase">Saving throws</h2>

      <Text size="xs" theme="secondary">
        Proficiency {{ formatModifier(bonus) }} · level {{ props.sheet.level }}
      </Text>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-max text-left">
        <thead>
          <tr class="text-xs text-secondary uppercase">
            <th scope="col" class="pr-3 pb-2 text-center font-normal">Prof</th>
            <th scope="col" class="pr-3 pb-2 font-normal">Save</th>
            <th scope="col" class="pb-2 text-right font-normal">Total</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="ability in ABILITIES"
            :key="ability.stat"
            class="border-t border-border"
          >
            <td class="pr-3">
              <button
                type="button"
                role="checkbox"
                :aria-checked="isProficient(ability.stat)"
                class="flex min-h-11 min-w-11 cursor-pointer items-center justify-center"
                @click="toggleProficiency(ability.stat)"
              >
                <span
                  class="flex size-5 items-center justify-center rounded-sm border transition-colors"
                  :class="
                    isProficient(ability.stat)
                      ? 'border-accent-primary bg-accent-primary text-bg-secondary'
                      : 'border-border'
                  "
                >
                  <Check v-if="isProficient(ability.stat)" :size="14" />
                </span>

                <span class="sr-only">{{ ability.name }} saving throw proficiency</span>
              </button>
            </td>

            <td class="pr-3 text-sm text-primary">{{ ability.name }}</td>

            <td class="text-right text-lg font-semibold text-primary tabular-nums">
              {{
                formatModifier(savingThrowTotal(props.sheet, ability.stat, props.items))
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
