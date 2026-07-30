<script setup lang="ts">
import { DialogTitle as DialogTitlePrimitive } from 'reka-ui';
</script>

<template>
  <!-- The primitive is what wires `aria-labelledby` on the dialog. -->
  <DialogTitlePrimitive as="h4" class="text-primary">
    <slot />
  </DialogTitlePrimitive>
</template>
