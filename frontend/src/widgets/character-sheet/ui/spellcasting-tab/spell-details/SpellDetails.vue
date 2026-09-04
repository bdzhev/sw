<script setup lang="ts">
import { computed } from 'vue';

import { Text } from '@shared/ui/text';

import type { SpellDetailsProps } from './SpellDetails.types';

/**
 * The spell card body, shared by the detail dialog and the search result's
 * expanded panel — so what you read before adding a spell is the same thing you
 * read after.
 */
const props = defineProps<SpellDetailsProps>();

const facts = computed(() => {
  return [
    { caption: 'Casting time', value: props.castingTime },
    { caption: 'Range', value: props.rangeText },
    { caption: 'Components', value: props.components },
    { caption: 'Duration', value: props.duration },
  ].filter((fact) => {
    return Boolean(fact.value);
  });
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <dl v-if="facts.length" class="grid grid-cols-2 gap-2">
      <div v-for="fact in facts" :key="fact.caption" class="flex flex-col">
        <dt class="text-xs text-secondary">{{ fact.caption }}</dt>

        <dd class="text-sm text-primary">{{ fact.value }}</dd>
      </div>
    </dl>

    <Text v-if="props.description" size="sm" class="whitespace-pre-wrap">
      {{ props.description }}
    </Text>

    <Text v-else size="sm" theme="secondary">No description on this one.</Text>

    <div v-if="props.higherLevel" class="flex flex-col gap-1">
      <span class="text-xs font-semibold text-primary uppercase">At higher levels</span>

      <Text size="sm" class="whitespace-pre-wrap">{{ props.higherLevel }}</Text>
    </div>
  </div>
</template>
