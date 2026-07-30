<script setup lang="ts">
import { DialogOverlay as DialogOverlayPrimitive } from 'reka-ui';
</script>

<template>
  <!--
    `fixed inset-0`, not the `absolute` + `h-screen w-screen` this replaces: body
    is a positioned element here, so `absolute` anchored the overlay to the
    document and it missed the viewport as soon as the page was scrolled.
  -->
  <DialogOverlayPrimitive
    class="fixed inset-0 z-1000 bg-bg-primary/70 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in motion-reduce:animate-none"
  />
</template>
