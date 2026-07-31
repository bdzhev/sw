<script setup lang="ts">
import { ToastTitle as ToastTitlePrimitive } from 'reka-ui';
</script>

<template>
  <ToastTitlePrimitive as="p" class="pr-6 text-sm font-medium text-primary">
    <slot />
  </ToastTitlePrimitive>
</template>
