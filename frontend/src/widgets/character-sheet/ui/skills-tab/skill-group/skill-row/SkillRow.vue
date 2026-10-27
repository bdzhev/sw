<script setup lang="ts">
import { Circle, CircleCheck, CircleDot } from 'lucide-vue-next';
import { computed } from 'vue';

import { Button } from '@shared/ui/button';

import type { SkillProficiencyLevel } from '@widgets/character-sheet/config/skills';
import { formatSigned } from '@widgets/character-sheet/lib/format';

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

const stateLabel = computed(() => {
  return PROFICIENCY_LABELS[props.proficiency];
});

const iconClasses = computed(() => {
  return PROFICIENCY_ICON_CLASSES[props.proficiency];
});

const handleCycleClick = (): void => {
  emit('cycle', props.skillKey);
};
</script>

<template>
  <tr class="border-b border-border last:border-0">
    <th scope="row" class="px-2 py-1 text-left text-sm font-normal whitespace-nowrap">
      {{ props.label }}
    </th>

    <td class="px-2 py-1 text-xs whitespace-nowrap text-secondary">
      {{ props.abilityLabel }}
    </td>

    <td class="px-2 py-1">
      <Button
        variant="transparent"
        size="xs"
        is-icon-only
        :title="`${props.label}: ${stateLabel}`"
        :aria-label="`${props.label} — ${stateLabel}. Activate to cycle.`"
        @click="handleCycleClick"
      >
        <component
          :is="PROFICIENCY_ICONS[props.proficiency]"
          :size="20"
          :class="iconClasses"
          aria-hidden="true"
        />
      </Button>
    </td>

    <td
      class="px-2 py-1 text-right text-base font-semibold whitespace-nowrap text-primary tabular-nums"
    >
      {{ formatSigned(props.modifier) }}
    </td>
  </tr>
</template>
