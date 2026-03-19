<script setup lang="ts">
import type { IconButtonProps } from './IconButton.props';
import { iconButtonThemes } from './IconButton.themes';

const props = withDefaults(defineProps<IconButtonProps>(), {
  variant: 'primary',
});

const theme = iconButtonThemes[props.variant];
</script>

<template>
  <button :class="theme" class="cursor-pointer">
    <slot />
  </button>
</template>
