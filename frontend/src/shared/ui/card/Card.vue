<script lang="ts" setup>
import { computed } from 'vue';

import type { CardProps } from './Card.types';

const props = withDefaults(defineProps<CardProps>(), {
  size: 'md',
  variant: 'primary',
  blur: true,
});

/**
 * Resolved in a `computed`, not destructured at setup scope: the old version read
 * the props once, so a variant that changed after mount never repainted.
 */
const cardClasses = computed(() => {
  const isOutline = props.variant === 'outline';

  return {
    'overflow-hidden': true,
    'backdrop-blur-xl': props.blur,
    'bg-bg-primary/80': props.variant === 'primary',
    'bg-bg-raised/80': props.variant === 'secondary',
    'ring-2 ring-border': !isOutline,
    'ring-2 ring-border/50': isOutline,
    'rounded-sm': props.size === 'sm',
    'rounded-md': props.size === 'md',
    'rounded-2xl': props.size === 'lg',
    'text-primary': !isOutline,
    'text-secondary': isOutline,
  };
});
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>
