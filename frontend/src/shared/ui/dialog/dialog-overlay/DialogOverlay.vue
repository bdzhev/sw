<script setup lang="ts">
import { DialogOverlay as DialogOverlayPrimitive } from 'reka-ui';
</script>

<template>
  <DialogOverlayPrimitive
    class="fixed inset-0 z-1000 bg-bg-primary/70 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in motion-reduce:animate-none"
  />
</template>
