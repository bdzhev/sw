<script lang="ts" setup>
import { computed, useAttrs, useId } from 'vue';

import type { InputProps } from './Input.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  placeholder: '',
  hasError: false,
  isDisabled: false,
});

const model = defineModel<string | number>({ default: '' });

const attrs = useAttrs();

const generatedId = useId();

const inputId = computed(() => {
  return props.id ?? generatedId;
});

/** `class` styles the box; everything else (aria-*, min, step) is the field's. */
const fieldAttrs = computed(() => {
  const rest = { ...attrs };

  delete rest.class;

  return rest;
});

const boxClasses = computed(() => {
  return [
    'flex w-full flex-row items-center gap-2 overflow-hidden rounded-sm ring-2 transition-all',
    props.isDisabled ? 'cursor-not-allowed bg-muted text-secondary' : 'bg-bg-raised',
    props.hasError
      ? 'ring-danger/50 focus-within:ring-danger'
      : 'ring-primary/50 focus-within:ring-primary',
  ];
});

/**
 * `text-base` below md: iOS Safari auto-zooms the page on focusing an input
 * whose font-size is under 16px.
 */
const fieldClasses =
  'm-0 min-w-0 flex-1 border-none bg-transparent bg-none px-2 py-3 text-base text-inherit outline-none placeholder:text-secondary md:py-2 md:text-sm';
</script>

<template>
  <div :class="[boxClasses, attrs.class]">
    <slot name="left" />

    <input
      v-bind="fieldAttrs"
      :id="inputId"
      v-model="model"
      :class="fieldClasses"
      :type="props.type"
      :inputmode="props.inputMode"
      :placeholder="props.placeholder"
      :disabled="props.isDisabled"
      :autocomplete="props.autocomplete"
      :aria-invalid="props.hasError || undefined"
    />

    <slot name="right" />
  </div>
</template>
