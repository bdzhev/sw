<script setup lang="ts">
import { useField } from 'vee-validate';

import { Switch } from '@shared/ui/switch';

import type { FormSwitchProps } from './FormSwitch.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<FormSwitchProps>(), { showError: true });

/**
 * The field-bound half. `useField` cannot be called conditionally, which is why
 * this is a separate component rather than an optional `name` prop on `Switch`
 * — the same split as `input` / `form-input`.
 *
 * The error message is rendered, unlike the first version of this component. A
 * boolean field can fail validation — most often by going `undefined` when a
 * conditionally-rendered switch unmounts and vee-validate drops its path — and
 * with nothing on screen that reads as "the form is broken and will not submit".
 */
const { value, errorMessage } = useField<boolean>(() => {
  return props.name;
});
</script>

<template>
  <div v-bind="$attrs" class="flex w-full flex-col">
    <Switch
      v-model="value"
      :label="props.label"
      :is-label-hidden="props.isLabelHidden"
      :is-disabled="props.isDisabled"
    >
      <template #icon>
        <slot name="icon" />
      </template>
    </Switch>

    <p v-if="props.showError && errorMessage" class="pt-1 text-xs text-danger">
      {{ errorMessage }}
    </p>
  </div>
</template>
