<script setup lang="ts">
import type { ModeButtonProps } from './ModeButton.types';

const props = defineProps<ModeButtonProps>();

/** A component rather than an inline handler, so the segment reports its own value. */
const emit = defineEmits<{ select: [value: string] }>();

const handleClick = (): void => {
  emit('select', props.value);
};
</script>

<template>
  <button
    type="button"
    :aria-pressed="props.isSelected"
    :class="[
      'min-h-11 cursor-pointer rounded-sm px-2 text-sm transition-colors md:min-h-9',
      props.isSelected
        ? 'bg-accent-primary/15 font-medium text-primary'
        : 'text-secondary hover:text-primary',
    ]"
    @click="handleClick"
  >
    {{ props.label }}
  </button>
</template>
