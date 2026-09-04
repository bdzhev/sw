<script setup lang="ts">
import { computed } from 'vue';

import { Button } from '@shared/ui/button';

import { slotLevelLabel } from '@widgets/character-sheet/lib/spellcasting';

import type { SlotOptionProps } from './SlotOption.types';

const props = withDefaults(defineProps<SlotOptionProps>(), { isSaving: false });

/** Carries its own slot level, so the list binds a bare handler. */
const emit = defineEmits<{ select: [slotLevel: number] }>();

const label = computed(() => {
  return slotLevelLabel(props.castableSlot.slotLevel);
});

const isSpent = computed(() => {
  return props.castableSlot.current <= 0;
});

const handleClick = (): void => {
  emit('select', props.castableSlot.slotLevel);
};
</script>

<template>
  <li>
    <Button
      variant="secondary"
      width="full"
      align="start"
      :is-disabled="isSpent || props.isSaving"
      class="min-h-11"
      @click="handleClick"
    >
      <span class="flex w-full items-center justify-between gap-3">
        <span>{{ label }}</span>

        <span class="text-xs text-secondary tabular-nums">
          {{ isSpent ? 'none left' : `${props.castableSlot.current} left` }}
        </span>
      </span>
    </Button>
  </li>
</template>
