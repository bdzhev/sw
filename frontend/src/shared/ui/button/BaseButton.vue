<script lang="ts" setup>
import { computed } from 'vue';

import type { ButtonProps } from './BaseButton.props';
import {
  variantClasses,
  paddingClasses,
  roundClasses,
  textClasses,
} from './BaseButton.themes';

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'sm',
  isDisabled: false,
  isLoading: false,
  isRound: false,
  equalPadding: false,
});

const buttonClasses = computed(() => {
  const variantClass = variantClasses[props.variant];

  const textClass = textClasses[props.size];

  const paddingClass = props.equalPadding
    ? paddingClasses.equalPadding[props.size]
    : paddingClasses[props.size];

  const roundClass = props.isRound ? 'rounded-full' : roundClasses[props.size];

  const loadingClass = props.isLoading ? 'loading-animation' : '';

  return [variantClass, textClass, roundClass, paddingClass, loadingClass].join(
    ' ',
  );
});
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.isDisabled || props.isLoading"
    :class="[
      `
        flex w-fit cursor-pointer flex-row items-center justify-center
        transition-all duration-200
        disabled:cursor-not-allowed disabled:bg-fg disabled:text-bg-secondary
        disabled:inset-ring-0
      `,
      buttonClasses,
    ]"
  >
    <slot />
  </button>
</template>
