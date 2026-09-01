<script setup lang="ts">
import { computed } from 'vue';

import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import type { IdentitySummaryProps } from './IdentitySummary.types';

const props = defineProps<IdentitySummaryProps>();

/**
 * Read-only, all three. Race and class are fixed at creation, and level moves
 * only through the level-up action — `updateSheetSchema` is `.strict()` and has
 * no `level`, so there is no endpoint this form could write it through.
 */
const entries = computed(() => {
  return [
    { key: 'race', label: 'race', value: String(props.race) },
    { key: 'class', label: 'class', value: String(props.characterClass) },
    { key: 'level', label: 'level', value: String(props.level) },
  ];
});
</script>

<template>
  <SheetSection
    title="Who they are"
    description="Set when the character was made. Level moves through levelling up."
  >
    <dl class="mt-4 grid grid-cols-3 gap-2">
      <div v-for="entry in entries" :key="entry.key" class="flex min-w-0 flex-col gap-1">
        <dt class="truncate text-xs text-secondary uppercase">{{ entry.label }}</dt>

        <dd class="truncate text-base font-semibold text-primary capitalize">
          {{ entry.value }}
        </dd>
      </div>
    </dl>
  </SheetSection>
</template>
