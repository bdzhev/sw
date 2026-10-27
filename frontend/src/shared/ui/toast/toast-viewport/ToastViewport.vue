<script setup lang="ts">
import { ToastViewport as ToastViewportPrimitive } from 'reka-ui';
</script>

<template>
  <!-- Top right at every width; `max-w-toast` is what keeps a phone from a full-bleed bar. -->
  <ToastViewportPrimitive
    class="fixed top-0 right-0 z-1200 flex w-full max-w-toast list-none flex-col items-end gap-2 p-4 outline-none"
  />
</template>
