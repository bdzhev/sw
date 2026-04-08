<script setup lang="ts">
import type { BaseTextProps } from './BaseText.props';

const props = withDefaults(defineProps<BaseTextProps>(), {
  size: 'md',
  theme: 'primary',
});

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
};

const themeClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  danger: 'text-danger',
  warning: 'text-warning',
};
</script>

<template>
  <p :class="`${sizeClasses[props.size]} ${themeClasses[props.theme]}`">
    <slot />
  </p>
</template>
