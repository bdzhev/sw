<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { DialogClose } from 'reka-ui';
</script>

<template>
  <DialogClose
    aria-label="Close"
    class="flex min-h-11 min-w-11 cursor-pointer items-center justify-end text-secondary hover:text-primary md:min-h-0 md:min-w-0"
  >
    <X :size="20" />
  </DialogClose>
</template>
