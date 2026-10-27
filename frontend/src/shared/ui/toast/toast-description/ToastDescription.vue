<script setup lang="ts">
import { ToastDescription as ToastDescriptionPrimitive } from 'reka-ui';
</script>

<template>
  <ToastDescriptionPrimitive as="p" class="text-sm text-secondary">
    <slot />
  </ToastDescriptionPrimitive>
</template>
