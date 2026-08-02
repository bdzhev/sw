<script setup lang="ts">
import { Circle, CircleCheck, CircleDot } from 'lucide-vue-next';
import { computed } from 'vue';

import { Button } from '@shared/ui/button';

import type { SkillProficiencyLevel } from '@widgets/character-sheet/config/skills';

import type { SkillRowProps } from './SkillRow.types';

const props = defineProps<SkillRowProps>();

const emit = defineEmits<{ cycle: [skillKey: string] }>();

const PROFICIENCY_ICONS = [Circle, CircleDot, CircleCheck];

const PROFICIENCY_LABELS = ['not proficient', 'proficient', 'expertise'];

/**
 * Colour sits on the icon, not the button: an empty entry inherits the
 * transparent variant's own hover colour instead of fighting it.
 */
const PROFICIENCY_ICON_CLASSES: Record<SkillProficiencyLevel, string> = {
  0: '',
  1: 'text-accent-primary',
  2: 'text-warning',
};

const modifier = computed(() => {
  return `${props.skill.modifier >= 0 ? '+' : ''}${props.skill.modifier}`;
});

const stateLabel = computed(() => {
  return PROFICIENCY_LABELS[props.skill.proficiency];
});

const iconClasses = computed(() => {
  return PROFICIENCY_ICON_CLASSES[props.skill.proficiency];
});

const handleCycleClick = (): void => {
  emit('cycle', props.skill.key);
};
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
      <Button
        variant="transparent"
        is-icon-only
        :title="`${props.skill.label}: ${stateLabel}`"
        :aria-label="`${props.skill.label} — ${stateLabel}. Activate to cycle.`"
        @click="handleCycleClick"
      >
        <component
          :is="PROFICIENCY_ICONS[props.skill.proficiency]"
          :size="20"
          :class="iconClasses"
          aria-hidden="true"
        />
      </Button>
    </td>

    <td
      class="px-2 py-1 text-right text-base font-semibold whitespace-nowrap text-primary tabular-nums"
    >
      {{ modifier }}
    </td>
  </tr>
</template>
