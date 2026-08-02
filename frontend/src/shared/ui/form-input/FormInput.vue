<script lang="ts" setup>
import { Label } from 'reka-ui';
import { useField } from 'vee-validate';
import { useAttrs, useId } from 'vue';

import { Input } from '@shared/ui/input';

import type { FormInputProps } from './FormInput.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormInputProps>(), {
  type: 'text',
  placeholder: '',
  isDisabled: false,
  validateOnValueUpdate: false,
  cleanErrorsOnFocus: true,
  showError: true,
});

/**
 * The field-bound half. `useField` cannot be called conditionally, which is why
 * this is a separate component rather than an optional `name` prop on `Input`.
 */
const { value, errorMessage, handleChange, handleBlur, setErrors } = useField<
  string | number
>(
  () => {
    return props.name;
  },
  undefined,
  { validateOnValueUpdate: props.validateOnValueUpdate },
);

const attrs = useAttrs();

const fieldId = useId();

/**
 * One write per keystroke. `handleChange` validates, which is what gates
 * submit buttons bound to `meta.valid`.
 */
const handleInput = (newValue: string | number): void => {
  handleChange(newValue);
};

const handleFocus = (): void => {
  if (props.cleanErrorsOnFocus) {
    setErrors([]);
  }
};
</script>

<template>
  <div :class="['flex w-full flex-col', attrs.class]">
    <Label v-if="props.label" :for="fieldId" class="mb-1 text-sm text-secondary">
      {{ props.label }}
    </Label>

    <Input
      :id="fieldId"
      :model-value="value"
      :name="props.name"
      :type="props.type"
      :placeholder="props.placeholder"
      :autocomplete="props.autocomplete"
      :is-disabled="props.isDisabled"
      :has-error="Boolean(errorMessage)"
      @update:model-value="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <template #left>
        <slot name="left" />
      </template>

      <template #right>
        <slot name="right" />
      </template>
    </Input>

    <!-- Fixed height so an appearing message does not shift the form. -->
    <div v-if="props.showError" class="h-6 pt-1">
      <p v-if="errorMessage" class="text-xs text-danger">{{ errorMessage }}</p>
    </div>
  </div>
</template>
