<script setup lang="ts">
import { computed, inject } from 'vue';

import { RADIO_CTX_KEY } from '../../constants';
import type { RadioContext } from '../../types';

import type { RadioInputProps } from './RadioInput.props';

const props = defineProps<RadioInputProps>();

const ctx = inject<RadioContext>(RADIO_CTX_KEY)!;

const currentItem = ctx.items.find((item) => {
  return item.value === props.name;
});

const isChecked = computed(() => {
  return ctx.currentValue.value === currentItem?.value;
})
</script>

<template>
  <div v-if="currentItem" @click="ctx.onChange(props.name)" :class="[`
    cursor-pointer rounded-md ring-2 transition-all duration-100
  `, isChecked ? `ring-accent-primary` : `
    ring-primary/30
    hover:ring-accent-primary/50
  `]">
    <input type="radio" :name="ctx.fieldName" :checked="isChecked" :value="props.name" class="
      appearance-none
    ">
    <label :for="props.name">{{ currentItem.label }}</label>
  </div>
</template>
