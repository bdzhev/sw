<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui';
import { useId } from 'vue';

import { FieldLabel } from '@shared/ui/field-label';

import type { CheckboxProps } from './Checkbox.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CheckboxProps>(), {
  isLabelHidden: false,
  isDisabled: false,
});

const checked = defineModel<boolean>({ default: false });

const checkboxId = useId();
</script>

<template>
  <div v-bind="$attrs" class="flex items-center gap-2">
    <CheckboxRoot
      :id="checkboxId"
      v-model="checked"
      :disabled="props.isDisabled"
      class="group flex min-h-11 min-w-11 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50 md:min-h-9 md:min-w-9"
    >
      <!-- reka sets data-state on the root, so the box reads it through `group`. -->
      <span
        class="flex size-5 items-center justify-center rounded-sm border border-border transition-colors group-data-[state=checked]:border-accent-primary group-data-[state=checked]:bg-accent-primary"
      >
        <CheckboxIndicator>
          <Check :size="14" class="text-bg-secondary" aria-hidden="true" />
        </CheckboxIndicator>
      </span>
    </CheckboxRoot>

    <FieldLabel
      :field-id="checkboxId"
      :is-hidden="props.isLabelHidden"
      class="cursor-pointer"
    >
      {{ props.label }}
    </FieldLabel>
  </div>
</template>
