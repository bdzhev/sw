<script setup lang="ts">
import { useField } from 'vee-validate';

import { NumberField } from '@shared/ui/number-field';

import type { FormNumberFieldProps } from './FormNumberField.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormNumberFieldProps>(), {
  isLabelHidden: false,
  size: 'md',
  step: 1,
  isDisabled: false,
  hasStepper: false,
  decrementLabel: 'Decrease',
  incrementLabel: 'Increase',
  showError: true,
});

/**
 * The field-bound half. `useField` cannot be called conditionally, which is why
 * this is a separate component rather than an optional `name` prop on
 * `NumberField` — the same split as `input` / `form-input`.
 *
 * The value is `number | undefined`: an emptied box is `undefined`, which is how
 * a schema expresses "left blank" as opposed to zero.
 */
const { value, errorMessage } = useField<number | undefined>(() => {
  return props.name;
});
</script>

<template>
  <div v-bind="$attrs" class="flex w-full flex-col">
    <NumberField
      v-model="value"
      :size="props.size"
      :label="props.label"
      :is-label-hidden="props.isLabelHidden"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :is-disabled="props.isDisabled"
      :has-stepper="props.hasStepper"
      :decrement-label="props.decrementLabel"
      :increment-label="props.incrementLabel"
    />

    <p v-if="props.showError && errorMessage" class="pt-1 text-xs text-danger">
      {{ errorMessage }}
    </p>
  </div>
</template>
