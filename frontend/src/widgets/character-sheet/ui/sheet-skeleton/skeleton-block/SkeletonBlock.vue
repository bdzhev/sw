<script setup lang="ts">
import { Skeleton } from '@shared/ui/skeleton';
</script>

<template>
  <!-- Skeleton hardcodes `h-full w-full`, so a sized wrapper is the only way to
       give it a shape. `overflow-hidden` is what makes the wrapper's radius clip it. -->
  <div class="overflow-hidden">
    <Skeleton />
  </div>
</template>
