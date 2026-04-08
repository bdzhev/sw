<script lang="ts" setup>
import { useField } from 'vee-validate';
import { computed } from 'vue';

import type { InputProps } from './BaseInput.props';

const props = withDefaults(defineProps<InputProps>(), {
  placeholder: '',
  error: null,
  disabled: false,
  type: 'text',
  validateOnValueUpdate: false,
  cleanErrorsOnFocus: true,
  showError: true,
});

const { value, errorMessage, handleChange, handleBlur, setErrors } = useField(
  () => {
    return props.name;
  },
  undefined,
  {
    validateOnValueUpdate: props.validateOnValueUpdate,
  },
);

const handleFocus = () => {
  if (props.cleanErrorsOnFocus) {
    setErrors([]);
  }
};

const inputClasses = computed(() => {
  return [
    'ring-2 w-full rounded-sm text-base outline-none transition-all',
    props.disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : '',
    errorMessage.value
      ? 'ring-error/50 focus-within:ring-error'
      : 'ring-primary/50 focus-within:ring-primary',
  ];
});

const innerInputClasses =
  'm-0 flex-1 border-none bg-transparent bg-none px-2 py-2 text-sm text-inherit outline-none placeholder:text-secondary';
</script>

<template>
  <div class="relative flex flex-row">
    <label v-if="props.label" class="mt-2 pr-3 text-sm" :for="props.name">
      {{ props.label }}
    </label>

    <div
      :class="[inputClasses, 'mb-6 flex items-center gap-2 overflow-hidden']"
    >
      <slot name="left" />

      <input
        :class="innerInputClasses"
        :type="type"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :autocomplete="props.autocomplete"
        v-model="value"
        @input="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <slot name="right" />
    </div>
    <p
      v-if="errorMessage && props.showError"
      class="absolute top-10 text-xs text-danger"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
