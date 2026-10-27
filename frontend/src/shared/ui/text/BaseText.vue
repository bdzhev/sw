<script setup lang="ts">
import type { BaseTextProps, TextSize, TextTheme } from './BaseText.props';

const props = withDefaults(defineProps<BaseTextProps>(), {
  size: 'md',
  theme: 'primary',
});

/** `md` was `text-md`, which is not a Tailwind class — the default size emitted nothing. */
const sizeClasses: Record<TextSize, string> = {
  xxs: 'text-xxs',
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const themeClasses: Record<TextTheme, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  accent: 'text-accent-primary',
  danger: 'text-danger',
  warning: 'text-warning',
};
</script>

<template>
  <p :class="`${sizeClasses[props.size]} ${themeClasses[props.theme]}`">
    <slot />
  </p>
</template>
