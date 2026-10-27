<script setup lang="ts">
import { Check, Minus } from 'lucide-vue-next';

import { Text } from '@shared/ui/text';

import { NO_CHANGES_LINE } from '@widgets/character-sheet/config/rest';

import type { RestSummaryProps } from './RestSummary.types';

const props = defineProps<RestSummaryProps>();
</script>

<template>
  <Text v-if="props.lines.length === 0" size="sm" theme="secondary">
    {{ NO_CHANGES_LINE }}
  </Text>

  <ul v-else class="flex flex-col gap-2">
    <!-- A line that restored nothing is kept and dimmed: leaving it out would
         read as "there was nothing there" rather than "nothing to restore". -->
    <li v-for="line in props.lines" :key="line.label" class="flex items-start gap-2">
      <Check
        v-if="line.isApplied"
        :size="16"
        class="mt-0.5 shrink-0 text-accent-primary"
      />
      <Minus v-else :size="16" class="mt-0.5 shrink-0 text-secondary" />

      <div class="flex min-w-0 flex-col">
        <Text size="sm" :theme="line.isApplied ? 'primary' : 'secondary'">
          {{ line.label }}
        </Text>

        <Text size="xs" theme="secondary">{{ line.detail }}</Text>
      </div>
    </li>
  </ul>
</template>
