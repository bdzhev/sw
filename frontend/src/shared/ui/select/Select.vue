<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui';
import { useField } from 'vee-validate';
import { computed } from 'vue';

import type { SelectOption, SelectProps } from './Select.types';

const props = withDefaults(defineProps<SelectProps>(), {
  placeholder: 'Select an option...',
});

const { value, errorMessage, handleBlur } = useField<SelectOption['value'] | undefined>(
  () => {
    return props.name;
  },
);

const handleSelect = () => {
  handleBlur();
};

/**
 * Derived from `options` rather than left to SelectValue: reka computes its own
 * label from a registry that SelectItemText fills on mount and clears on
 * unmount, and closing the list remounts every item (content tree → detached
 * fragment), so the registry is briefly empty and the placeholder flashes.
 */
const selectedLabel = computed(() => {
  return props.options.find((option) => {
    return option.value === value.value;
  })?.label;
});
</script>

<template>
  <div class="mb-1 w-full">
    <SelectRoot v-model="value" @update:model-value="handleSelect">
      <SelectTrigger
        :class="[
          'flex min-h-11 w-full cursor-pointer items-center justify-between rounded-md bg-bg-raised px-3 py-2 text-base text-secondary ring-2 transition-all duration-200 hover:bg-bg-raised-hover focus:ring-secondary focus:outline-none md:min-h-0 md:text-sm',
          errorMessage ? 'ring-danger/50' : 'ring-primary/50',
        ]"
      >
        <SelectValue
          :class="['truncate', selectedLabel ? 'text-primary' : 'text-secondary']"
        >
          {{ selectedLabel ?? props.placeholder }}
        </SelectValue>

        <SelectIcon>
          <ChevronDown :size="16" />
        </SelectIcon>
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          position="popper"
          :side-offset="4"
          class="z-1100 max-h-60 w-(--reka-select-trigger-width) overflow-hidden rounded-md bg-bg-secondary shadow-xl"
        >
          <SelectViewport class="max-h-60 overflow-y-auto">
            <SelectItem
              v-for="option in props.options"
              :key="option.value"
              :value="option.value"
              class="flex min-h-11 cursor-pointer items-center px-3 py-2 text-base text-primary transition-colors duration-150 data-highlighted:bg-bg-primary data-highlighted:text-accent-primary data-highlighted:outline-none data-[state=checked]:bg-fg md:min-h-0 md:text-sm"
            >
              <SelectItemText>{{ option.label }}</SelectItemText>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>

    <p v-if="errorMessage" class="mt-1 text-xs font-medium text-danger">
      {{ errorMessage }}
    </p>
  </div>
</template>
