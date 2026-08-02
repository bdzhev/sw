<script setup lang="ts">
import { computed } from 'vue';

import type { StatFieldProps } from './StatField.types';

const props = withDefaults(defineProps<StatFieldProps>(), {
  readonly: false,
  min: 0,
  max: 999,
});

const emit = defineEmits<{ 'update:modelValue': [value: number] }>();

const clamped = (raw: number): number => {
  return Math.min(props.max, Math.max(props.min, raw));
};

const onInput = (event: Event) => {
  const parsed = Number((event.target as HTMLInputElement).value);

  emit('update:modelValue', clamped(Number.isNaN(parsed) ? props.min : parsed));
};

const inputId = computed(() => {
  return `stat-${props.label.toLowerCase().replace(/\s+/g, '-')}`;
});
</script>

<template>
  <div class="flex min-w-0 flex-col gap-1">
    <label :for="inputId" class="truncate text-xs text-secondary uppercase">
      {{ props.label }}
    </label>

    <p v-if="props.readonly" class="text-xl font-semibold text-primary tabular-nums">
      {{ props.modelValue }}
    </p>

    <input
      v-else
      :id="inputId"
      type="number"
      inputmode="numeric"
      :value="props.modelValue"
      :min="props.min"
      :max="props.max"
      class="w-full rounded-md border border-border bg-bg-primary px-2 py-1 text-xl font-semibold text-primary tabular-nums outline-none focus:border-accent-primary"
      @input="onInput"
    />
  </div>
</template>
