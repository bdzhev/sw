<script setup lang="ts">
import { computed } from 'vue';

import type { CharacterStat } from '@shared/api/characters';
import { Checkbox } from '@shared/ui/checkbox';

import { formatSigned } from '@widgets/character-sheet/lib/format';

import type { SavingThrowRowProps } from './SavingThrowRow.types';

const props = defineProps<SavingThrowRowProps>();

const emit = defineEmits<{ toggle: [stat: CharacterStat] }>();

/** The set lives on the sheet, so the row reports the stat and owns nothing. */
const isChecked = computed({
  get: (): boolean => {
    return props.isProficient;
  },
  set: (): void => {
    emit('toggle', props.ability.stat);
  },
});
</script>

<template>
  <tr class="border-t border-border">
    <td class="w-11 py-2">
      <Checkbox
        v-model="isChecked"
        :label="`${props.ability.name} saving throw proficiency`"
        is-label-hidden
      />
    </td>

    <td class="py-2 pr-3 text-sm text-primary">{{ props.ability.name }}</td>

    <td class="py-2 text-right text-lg font-semibold text-primary tabular-nums">
      {{ formatSigned(props.total) }}
    </td>
  </tr>
</template>
