<script setup lang="ts">
import { Skeleton } from '@shared/ui/skeleton';
</script>

<template>
  <div class="relative flex h-full w-full flex-row items-center justify-center">
    <div class="absolute -left-8 z-0 h-150 w-225 opacity-50">
      <Skeleton class="rounded-xl" />
    </div>

    <div class="z-10 h-180 w-270 bg-primary-bg">
      <Skeleton class="rounded-xl" />
    </div>

    <div class="absolute -right-8 z-0 h-150 w-225 opacity-50">
      <Skeleton class="rounded-xl" />
    </div>
  </div>
</template>
