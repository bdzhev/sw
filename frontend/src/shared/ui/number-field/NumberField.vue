<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next';
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from 'reka-ui';
import { useId } from 'vue';

import { FieldLabel } from '@shared/ui/field-label';

import { inputSizeClasses } from './NumberField.themes';
import type { NumberFieldProps } from './NumberField.types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<NumberFieldProps>(), {
  isLabelHidden: false,
  size: 'md',
  step: 1,
  isDisabled: false,
  hasStepper: false,
  decrementLabel: 'Decrease',
  incrementLabel: 'Increase',
});

/**
 * Clamping and parsing belong to reka, not to each call site. Five separate
 * hand-written `clamp`s existed before this, and "what does an empty box mean"
 * had three different answers — one of which set the value to 0, so clearing
 * the HP field zeroed your HP.
 *
 * `undefined` is the empty box, which is reka's own answer and has to be in the
 * type: it emits `undefined` when the input cannot be parsed, and renders an
 * empty string back for it.
 */
const value = defineModel<number | undefined>();

const fieldId = useId();

const STEP_BUTTON_CLASSES =
  'flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-primary transition-colors enabled:hover:border-accent-primary disabled:cursor-not-allowed disabled:text-secondary md:min-h-9 md:min-w-9';
</script>

<template>
  <div v-bind="$attrs" class="flex min-w-0 flex-col gap-1">
    <FieldLabel
      :field-id="fieldId"
      :is-hidden="props.isLabelHidden"
      class="flex items-center gap-1"
    >
      {{ props.label }}

      <slot name="label-icon" />
    </FieldLabel>

    <!--
      reka changes the value on wheel by default, so scrolling the page with a field
      focused silently edits it.
    -->
    <NumberFieldRoot
      :id="fieldId"
      v-model="value"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :disabled="props.isDisabled"
      disable-wheel-change
      class="flex items-center gap-2"
    >
      <NumberFieldDecrement
        v-if="props.hasStepper"
        :aria-label="props.decrementLabel"
        :class="STEP_BUTTON_CLASSES"
      >
        <Minus :size="18" aria-hidden="true" />
      </NumberFieldDecrement>

      <NumberFieldInput
        inputmode="numeric"
        :class="[
          'min-h-11 w-full min-w-0 rounded-md border border-border bg-bg-raised text-center font-semibold text-primary tabular-nums outline-none focus:border-accent-primary disabled:cursor-not-allowed disabled:bg-muted disabled:text-secondary md:min-h-9',
          inputSizeClasses[props.size],
        ]"
      />

      <NumberFieldIncrement
        v-if="props.hasStepper"
        :aria-label="props.incrementLabel"
        :class="STEP_BUTTON_CLASSES"
      >
        <Plus :size="18" aria-hidden="true" />
      </NumberFieldIncrement>
    </NumberFieldRoot>
  </div>
</template>
