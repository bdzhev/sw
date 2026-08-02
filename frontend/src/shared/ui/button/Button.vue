<script lang="ts" setup>
import { Primitive } from 'reka-ui';
import { computed } from 'vue';

import {
  equalPaddingClasses,
  paddingClasses,
  roundClasses,
  textClasses,
  variantClasses,
  widthClasses,
} from './Button.themes';
import type { ButtonProps } from './Button.types';

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'sm',
  isDisabled: false,
  isLoading: false,
  isRound: false,
  equalPadding: false,
  isIconOnly: false,
  width: 'fit',
  as: 'button',
});

const isButtonElement = computed(() => {
  return props.as === 'button';
});

const buttonClasses = computed(() => {
  const isSquare = props.isIconOnly || props.equalPadding;

  return [
    variantClasses[props.variant],
    textClasses[props.size],
    props.isRound ? 'rounded-full' : roundClasses[props.size],
    isSquare ? equalPaddingClasses[props.size] : paddingClasses[props.size],
    props.isIconOnly ? 'min-h-11 min-w-11 md:min-h-0 md:min-w-0' : '',
    widthClasses[props.width],
    props.isLoading ? 'loading-animation' : '',
  ];
});

const isDisabled = computed(() => {
  return props.isDisabled || props.isLoading;
});
</script>

<template>
  <Primitive
    :as="props.as"
    :type="isButtonElement ? props.type : undefined"
    :disabled="isButtonElement ? isDisabled : undefined"
    :aria-disabled="isButtonElement ? undefined : isDisabled || undefined"
    :class="[
      `flex cursor-pointer flex-row items-center justify-center transition-all duration-200 disabled:cursor-not-allowed disabled:bg-fg disabled:text-bg-secondary disabled:inset-ring-0 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50`,
      buttonClasses,
    ]"
  >
    <slot />
  </Primitive>
</template>
