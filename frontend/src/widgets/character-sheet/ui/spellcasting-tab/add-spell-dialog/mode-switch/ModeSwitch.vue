<script setup lang="ts">
import { ModeButton } from './mode-button';
import type { ModeSwitchProps } from './ModeSwitch.types';

/**
 * A segmented control of equal weight, not a toggle with an advanced mode
 * behind it: an arcane trickster's class search legitimately finds nothing, so
 * the other paths have to stay one visible tap away rather than one menu down.
 */
const props = defineProps<ModeSwitchProps>();

const selected = defineModel<string>({ required: true });

const handleSelect = (value: string): void => {
  selected.value = value;
};
</script>

<template>
  <div
    role="group"
    :aria-label="props.legend"
    class="grid grid-cols-3 gap-1 rounded-md border border-border p-1"
  >
    <ModeButton
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
      :label="option.label"
      :is-selected="selected === option.value"
      @select="handleSelect"
    />
  </div>
</template>
