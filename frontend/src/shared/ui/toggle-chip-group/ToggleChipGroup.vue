<script setup lang="ts">
import { ToggleGroupItem, ToggleGroupRoot } from 'reka-ui';

import type { ToggleChipGroupProps } from './ToggleChipGroup.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleChipGroupProps>(), {
  isDisabled: false,
});

const selected = defineModel<string[]>({
  default: () => {
    return [];
  },
});
</script>

<template>
  <fieldset v-bind="$attrs" class="min-w-0 border-0 p-0">
    <legend class="sr-only">{{ props.legend }}</legend>

    <ToggleGroupRoot
      v-model="selected"
      type="multiple"
      :disabled="props.isDisabled"
      class="flex flex-wrap gap-2"
    >
      <ToggleGroupItem
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
        class="flex min-h-11 cursor-pointer items-center gap-1 rounded-full border border-border px-3 text-sm text-secondary transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=on]:border-accent-primary data-[state=on]:bg-accent-primary/15 data-[state=on]:text-primary md:min-h-9"
      >
        <component :is="option.icon" v-if="option.icon" :size="14" aria-hidden="true" />

        {{ option.label }}
      </ToggleGroupItem>
    </ToggleGroupRoot>
  </fieldset>
</template>
