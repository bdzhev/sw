<script lang="ts" setup>
  import { noop } from '@vueuse/core';
  import { RouterLink } from 'vue-router';

  import type { NavLinkProps } from './NavLink.props';

  const props = withDefaults(defineProps<NavLinkProps>(), {
    onClick: noop,
  });

  const { link, onClick: handleLinkClick } = props;
</script>

<template>
  <RouterLink
    @click="handleLinkClick"
    :to="link"
    :class="{
      'text-primary/70': true,
      'transition-all duration-300 hover:text-secondary': true,
    }"
  >
    <slot />
  </RouterLink>
</template>
