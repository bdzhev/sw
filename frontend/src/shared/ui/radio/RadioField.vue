<script setup lang="ts">
import { useField } from 'vee-validate';
import { provide } from 'vue';

import { RADIO_CTX_KEY } from './constants';
import type { RadioFieldProps } from './RadioField.props';
import type { RadioContext } from './types';

const props = defineProps<RadioFieldProps>();

const { value, setValue } = useField<string | number>(() => props.name);

const handleChange = (newValue: string | number) => {
  setValue(newValue);
}

provide<RadioContext>(RADIO_CTX_KEY, {
  onChange: handleChange,
  items: props.items,
  currentValue: value,
  fieldName: props.name,
});
</script>

<template>
  <slot />
</template>
