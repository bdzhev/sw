<script setup lang="ts">
import { useField } from 'vee-validate';
import { useAttrs, useId } from 'vue';

import { Select } from '@shared/ui/select';
import type { SelectOption } from '@shared/ui/select';

import type { FormSelectProps } from './FormSelect.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormSelectProps>(), {
  placeholder: 'Select an option...',
  isLabelHidden: false,
  isDisabled: false,
  showError: true,
});

/**
 * The field-bound half. `useField` cannot be called conditionally, which is why
 * this is a separate component rather than an optional `name` prop on `Select`.
 */
const { value, errorMessage, handleChange, handleBlur } = useField<
  SelectOption['value'] | undefined
>(() => {
  return props.name;
});

const attrs = useAttrs();

const fieldId = useId();

/** A list has no blur of its own — picking an option is the field being done with. */
const handleSelect = (newValue: SelectOption['value'] | undefined): void => {
  handleChange(newValue);
  handleBlur();
};
</script>

<template>
  <div :class="['flex w-full flex-col gap-1', attrs.class]">
    <Select
      :id="fieldId"
      :model-value="value"
      :options="props.options"
      :label="props.label"
      :is-label-hidden="props.isLabelHidden"
      :placeholder="props.placeholder"
      :is-disabled="props.isDisabled"
      :has-error="Boolean(errorMessage)"
      @update:model-value="handleSelect"
    />

    <p
      v-if="props.showError && errorMessage"
      class="pt-1 text-xs font-medium text-danger"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
