<script setup lang="ts">
import { DropdownMenuItem as DropdownMenuItemPrimitive } from 'reka-ui';
</script>

<template>
  <DropdownMenuItemPrimitive
    class="flex cursor-pointer flex-row items-center gap-2 px-4 py-3 transition-colors outline-none hover:bg-bg-primary/20 hover:text-accent-primary data-highlighted:bg-bg-primary/20 data-highlighted:text-accent-primary md:py-2"
  >
    <slot />
  </DropdownMenuItemPrimitive>
</template>
