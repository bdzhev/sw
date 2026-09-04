<script setup lang="ts">
import { Primitive } from 'reka-ui';
import { useField } from 'vee-validate';
import { computed, useId } from 'vue';

import { FieldLabel } from '@shared/ui/field-label';

import type { TextareaProps } from './Textarea.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TextareaProps>(), {
  placeholder: '',
  rows: 4,
  disabled: false,
  showError: true,
  isLabelHidden: false,
});

/** Not the field `name`: two textareas bound to one field would share an id. */
const fieldId = useId();

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
    'w-full resize-y rounded-sm bg-bg-raised px-2 py-3 text-base text-primary ring-2 outline-none transition-all placeholder:text-secondary md:py-2 md:text-sm',
    props.disabled ? 'cursor-not-allowed bg-muted text-secondary' : '',
    errorMessage.value
      ? 'ring-danger/50 focus-within:ring-danger'
      : 'ring-primary/50 focus-within:ring-primary',
  ];
});
</script>

<template>
  <div class="flex w-full flex-col gap-1">
    <FieldLabel v-if="props.label" :field-id="fieldId" :is-hidden="props.isLabelHidden">
      {{ props.label }}
    </FieldLabel>

    <Primitive
      as="textarea"
      v-bind="$attrs"
      :id="fieldId"
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
