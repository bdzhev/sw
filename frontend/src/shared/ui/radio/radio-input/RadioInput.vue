<script setup lang="ts">
import { computed, inject, useId } from 'vue';

import { RADIO_CTX_KEY } from '../constants';
import type { RadioContext } from '../types';
import type { RadioInputProps } from './RadioInput.types';

const props = defineProps<RadioInputProps>();

const ctx = inject<RadioContext>(RADIO_CTX_KEY)!;

const inputId = useId();

const currentItem = ctx.items.find((item) => {
  return item.value === props.name;
});

const isChecked = computed(() => {
  return ctx.currentValue.value === currentItem?.value;
});

const handleClick = (): void => {
  ctx.onChange(props.name);
};
</script>

<template>
  <div
    v-if="currentItem"
    :class="[
      `cursor-pointer rounded-md ring-2 transition-all duration-100`,
      isChecked
        ? `text-accent-primary ring-accent-primary`
        : `text-primary/80 ring-primary/30 hover:ring-accent-primary/50`,
    ]"
    @click="handleClick"
  >
    <input
      :id="inputId"
      type="radio"
      :name="ctx.fieldName"
      :checked="isChecked"
      :value="props.name"
      class="appearance-none"
    />

    <label :for="inputId" class="text-sm">{{ currentItem.label }}</label>
  </div>
</template>
