<script setup lang="ts">
import { SkillRow } from './skill-row';
import type { SkillGroupProps } from './SkillGroup.types';

const props = defineProps<SkillGroupProps>();

const emit = defineEmits<{ cycle: [skillKey: string] }>();

const handleCycle = (skillKey: string): void => {
  emit('cycle', skillKey);
};
</script>

<template>
  <tbody class="border-b border-border last:border-0">
    <tr>
      <th
        scope="colgroup"
        colspan="4"
        class="rounded-sm bg-bg-primary px-2 py-2 text-left text-xs font-medium tracking-wide text-secondary uppercase"
      >
        {{ props.group.label }}
      </th>
    </tr>

    <SkillRow
      v-for="skill in props.group.skills"
      :key="skill.key"
      :skill="skill"
      @cycle="handleCycle"
    />
  </tbody>
</template>
