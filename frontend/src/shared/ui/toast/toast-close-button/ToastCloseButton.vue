<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { ToastClose } from 'reka-ui';
</script>

<template>
  <ToastClose
    aria-label="Close"
    class="absolute top-2 right-2 flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-secondary hover:text-primary md:min-h-6 md:min-w-6"
  >
    <X :size="16" />
  </ToastClose>
</template>
