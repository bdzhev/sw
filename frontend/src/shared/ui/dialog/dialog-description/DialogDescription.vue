<script setup lang="ts">
import { DialogDescription as DialogDescriptionPrimitive } from 'reka-ui';
</script>

<template>
  <!-- The primitive is what wires `aria-describedby` on the dialog. -->
  <DialogDescriptionPrimitive as="p" class="text-secondary">
    <slot />
  </DialogDescriptionPrimitive>
</template>
