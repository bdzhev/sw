<script setup lang="ts">
import { computed } from 'vue';

import { ATTACK_PROPERTIES } from '@widgets/character-sheet/config/combat';

import type { PropertyBadgesProps } from './PropertyBadges.types';

const props = defineProps<PropertyBadgesProps>();

const badges = computed(() => {
  return props.properties.map((key) => {
    const known = ATTACK_PROPERTIES.find((property) => {
      return property.key === key;
    });

    return { key, label: known?.label ?? key, icon: known?.icon ?? null };
  });
});
</script>

<template>
  <ul class="flex flex-wrap items-center gap-1">
    <li
      v-for="badge in badges"
      :key="badge.key"
      class="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-secondary"
    >
      <component :is="badge.icon" v-if="badge.icon" :size="12" aria-hidden="true" />

      {{ badge.label }}
    </li>
  </ul>
</template>
