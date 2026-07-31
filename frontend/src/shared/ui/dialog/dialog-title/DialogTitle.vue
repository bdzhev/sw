<script setup lang="ts">
import { DialogTitle as DialogTitlePrimitive } from 'reka-ui';
</script>

<template>
  <DialogTitlePrimitive as="h4" class="text-primary">
    <slot />
  </DialogTitlePrimitive>
</template>
