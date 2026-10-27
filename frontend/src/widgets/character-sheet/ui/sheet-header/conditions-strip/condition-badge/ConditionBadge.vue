<script setup lang="ts">
import { X } from 'lucide-vue-next';

import { Button } from '@shared/ui/button';

import type { ConditionBadgeProps } from './ConditionBadge.types';

const props = defineProps<ConditionBadgeProps>();

const emit = defineEmits<{ remove: [condition: string] }>();

const handleRemoveClick = (): void => {
  emit('remove', props.condition);
};
</script>

<template>
  <span
    class="flex items-center gap-1 rounded-full bg-warning/20 py-1 pr-1 pl-3 text-xs text-warning"
  >
    {{ props.condition }}

    <Button
      variant="warning"
      size="xs"
      is-icon-only
      :aria-label="`Remove ${props.condition}`"
      @click="handleRemoveClick"
    >
      <X :size="14" />
    </Button>
  </span>
</template>
