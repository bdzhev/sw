<script setup lang="ts">
import { SkillRow } from './skill-row';
import type { SkillGroupProps } from './SkillGroup.types';

const props = defineProps<SkillGroupProps>();

const emit = defineEmits<{ cycle: [skillKey: string] }>();
</script>

<template>
  <tbody class="border-b border-border last:border-0">
    <tr>
      <th
        scope="colgroup"
        colspan="4"
        class="bg-bg-secondary px-2 py-2 text-left text-xs font-medium tracking-wide text-secondary uppercase"
      >
        {{ props.group.label }}
      </th>
    </tr>

    <SkillRow
      v-for="skill in props.group.skills"
      :key="skill.key"
      :skill="skill"
      @cycle="emit('cycle', $event)"
    />
  </tbody>
</template>
