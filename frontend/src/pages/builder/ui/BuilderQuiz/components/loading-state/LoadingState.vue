<script setup lang="ts">
import { Skeleton } from '@shared/ui/skeleton';
</script>

<template>
  <header class="flex h-40 w-full flex-row items-center justify-between">
    <Skeleton />

    <div class="flex flex-row">
      <Skeleton />

      <Skeleton />
    </div>
  </header>
</template>