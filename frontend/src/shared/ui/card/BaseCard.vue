<script lang="ts" setup>
import type { CardProps } from './BaseCard.props';

const props = withDefaults(defineProps<CardProps>(), {
  size: 'md',
  variant: 'primary',
  blur: true,
});

const { size, variant, blur } = props;

const isPrimary = variant === 'primary';
const isSecondary = variant === 'secondary';
const isOutline = variant === 'outline';
</script>

<template>
  <div
    :class="{
      'overflow-hidden': true,
      'backdrop-blur-xl': blur,
      'bg-primary-bg/80': isPrimary,
      'bg-secondary-bg/80': isSecondary,
      'bg-transparent': isOutline,
      'ring-2 ring-border': !isOutline,
      'ring-2 ring-border/50': isOutline,
      'rounded-sm': size === 'sm',
      'rounded-md': size === 'md',
      'rounded-2xl': size === 'lg',
      'text-primary': !isOutline,
      'text-secondary': isOutline,
    }"
  >
    <slot />
  </div>
</template>
