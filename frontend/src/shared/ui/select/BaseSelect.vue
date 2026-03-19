<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { ChevronDown } from 'lucide-vue-next';
import { ChevronUp } from 'lucide-vue-next';
import { useField } from 'vee-validate';
import { ref, onMounted } from 'vue';

import type { SelectProps } from './BaseSelect.props';

const props = defineProps<SelectProps>();

const { value, errorMessage, setValue, handleBlur } = useField(
  () => props.name,
);
const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const handleSelectButtonClick = () => {
  isOpen.value = !isOpen.value;
};

const handleItemClick = (optionValue: string | number) => {
  value.value = optionValue;
  setValue(optionValue);
  handleBlur();
  isOpen.value = false;
};

onMounted(() => {
  onClickOutside(containerRef, () => {
    isOpen.value = false;
  });
});
</script>

<!--prettier-ignore-->
<template>
  <div ref="containerRef" class="relative mb-1 w-full">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="handleSelectButtonClick"
      class="
        flex w-full items-center justify-between rounded-md bg-primary-bg px-3
        py-2 text-sm text-secondary ring-2 ring-primary/50 transition-all
        duration-200
        hover:bg-primary-fg
        focus:ring-2 focus:ring-secondary focus:outline-none
      "
      :class="{
        'border-red-300 bg-red-50 ring-2 ring-red-200': errorMessage,
        'cursor-pointer': true,
      }"
    >
      <span class="truncate" :class="{ 'text-gray-500': !value }">
        {{
          props.options.find((o) => o.value === value)?.label ||
          'Select an option...'
        }}
      </span>

      <ChevronDown :size="16" v-if="!isOpen"/>
      <ChevronUp :size="16" v-if="isOpen"/>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="
        absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md
        bg-primary-fg shadow-xl
      "
    >
      <div
        v-for="option in props.options"
        :key="option.value"
        @click="handleItemClick(option.value)"
        class="
          flex cursor-pointer items-center px-3 py-2 text-sm text-primary
          transition-colors duration-150
          hover:bg-primary-bg
          focus:bg-gray-50
        "
        :class="{
          'bg-fg text-primary':
            option.value === value,
          'text-bg-primary': option.value !== value,
        }"
      >
        {{ option.label }}
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-1 text-xs font-medium text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>
