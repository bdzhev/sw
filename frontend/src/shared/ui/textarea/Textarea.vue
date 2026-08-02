<script setup lang="ts">
import { Label, Primitive } from 'reka-ui';
import { useField } from 'vee-validate';
import { computed } from 'vue';

import type { TextareaProps } from './Textarea.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TextareaProps>(), {
  placeholder: '',
  rows: 4,
  disabled: false,
  showError: true,
});

/**
 * Field-bound like `input` and `select`, so a form only ever names the field.
 * reka has no textarea part, so this is `Primitive as="textarea"` — which means
 * no `v-model`: the value is bound and `handleChange` reads the event.
 */
const { value, errorMessage, handleChange, handleBlur } = useField<string>(() => {
  return props.name;
});

const textareaClasses = computed(() => {
  return [
    'w-full resize-y rounded-sm bg-transparent px-2 py-3 text-base text-primary ring-2 outline-none transition-all placeholder:text-secondary md:py-2 md:text-sm',
    props.disabled ? 'cursor-not-allowed text-secondary' : '',
    errorMessage.value
      ? 'ring-danger/50 focus-within:ring-danger'
      : 'ring-primary/50 focus-within:ring-primary',
  ];
});
</script>

<template>
  <div class="flex w-full flex-col gap-1">
    <Label v-if="props.label" :for="props.name" class="text-sm text-secondary">
      {{ props.label }}
    </Label>

    <Primitive
      as="textarea"
      v-bind="$attrs"
      :id="props.name"
      :name="props.name"
      :value="value"
      :rows="props.rows"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :class="textareaClasses"
      @input="handleChange"
      @blur="handleBlur"
    />

    <p v-if="errorMessage && props.showError" class="text-xs text-danger">
      {{ errorMessage }}
    </p>
  </div>
</template>
