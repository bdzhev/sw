<script setup lang="ts">
import { useField } from 'vee-validate';

import { Switch } from '@shared/ui/switch';

import type { FormSwitchProps } from './FormSwitch.types';

defineOptions({ inheritAttrs: false });

const props = defineProps<FormSwitchProps>();

/**
 * The field-bound half. `useField` cannot be called conditionally, which is why
 * this is a separate component rather than an optional `name` prop on `Switch`
 * — the same split as `input` / `form-input`.
 */
const { value } = useField<boolean>(() => {
  return props.name;
});
</script>

<template>
  <Switch
    v-bind="$attrs"
    v-model="value"
    :label="props.label"
    :is-label-hidden="props.isLabelHidden"
    :is-disabled="props.isDisabled"
  >
    <template #icon>
      <slot name="icon" />
    </template>
  </Switch>
</template>
