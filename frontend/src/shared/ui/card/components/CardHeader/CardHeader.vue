<script setup lang="ts">
import type { CardHeaderProps } from './CardHeader.props';

const props = defineProps<CardHeaderProps>();
</script>

<template>
  <div
    :class="{
      'border-b-1 border-secondary': props.hasDivider,
      'flex w-full flex-row': true,
    }"
  >
    <slot />
  </div>
</template>
