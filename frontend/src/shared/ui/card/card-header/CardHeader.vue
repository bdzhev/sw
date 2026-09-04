<script setup lang="ts">
import type { CardHeaderProps } from './CardHeader.types';

const props = defineProps<CardHeaderProps>();
</script>

<template>
  <div
    :class="{
      'border-b border-secondary': props.hasDivider,
      'flex w-full flex-row': true,
    }"
  >
    <slot />
  </div>
</template>
