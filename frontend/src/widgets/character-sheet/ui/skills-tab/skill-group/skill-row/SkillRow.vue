<script setup lang="ts">
import { Circle, CircleCheck, CircleDot } from 'lucide-vue-next';
import { computed } from 'vue';

import type { SkillRowProps } from './SkillRow.types';

const props = defineProps<SkillRowProps>();

const emit = defineEmits<{ cycle: [skillKey: string] }>();

const PROFICIENCY_ICONS = [Circle, CircleDot, CircleCheck];

const PROFICIENCY_LABELS = ['not proficient', 'proficient', 'expertise'];

const PROFICIENCY_CLASSES = [
  'text-secondary hover:text-primary',
  'text-accent-primary',
  'text-warning',
];

const modifier = computed(() => {
  return `${props.skill.modifier >= 0 ? '+' : ''}${props.skill.modifier}`;
});
</script>

<template>
  <tr class="border-b border-border last:border-0">
    <th scope="row" class="px-2 py-1 text-left text-sm font-normal whitespace-nowrap">
      {{ props.skill.label }}
    </th>

    <td class="px-2 py-1 text-xs whitespace-nowrap text-secondary">
      {{ props.skill.abilityLabel }}
    </td>

    <td class="px-2 py-1">
      <button
        type="button"
        class="flex size-11 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        :class="PROFICIENCY_CLASSES[props.skill.proficiency]"
        :title="`${props.skill.label}: ${PROFICIENCY_LABELS[props.skill.proficiency]}`"
        @click="emit('cycle', props.skill.key)"
      >
        <component :is="PROFICIENCY_ICONS[props.skill.proficiency]" :size="20" />

        <span class="sr-only">
          {{ props.skill.label }} — {{ PROFICIENCY_LABELS[props.skill.proficiency] }}. Tap
          to cycle.
        </span>
      </button>
    </td>

    <td
      class="px-2 py-1 text-right text-base font-semibold whitespace-nowrap text-primary tabular-nums"
    >
      {{ modifier }}
    </td>
  </tr>
</template>
