<script setup lang="ts">
import { DialogDescription as DialogDescriptionPrimitive } from 'reka-ui';
</script>

<template>
  <DialogDescriptionPrimitive as="p" class="text-secondary">
    <slot />
  </DialogDescriptionPrimitive>
</template>
