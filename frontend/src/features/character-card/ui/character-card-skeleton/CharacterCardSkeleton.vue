<script setup lang="ts">
import { Card } from '@shared/ui/card';
import { Skeleton } from '@shared/ui/skeleton';
</script>

<template>
  <Card class="col-span-1 row-span-1 flex flex-col justify-between p-6">
    <div class="flex flex-col gap-3">
      <div class="h-4 w-60">
        <Skeleton class="rounded-sm" />
      </div>

      <div class="h-4 w-30">
        <Skeleton class="rounded-sm" />
      </div>

      <div class="h-4 w-30">
        <Skeleton class="rounded-sm" />
      </div>
    </div>

    <div class="flex flex-row items-baseline justify-between">
      <div class="h-6 w-6">
        <Skeleton class="rounded-sm" />
      </div>

      <div class="h-8 w-36">
        <Skeleton class="rounded-sm" />
      </div>
    </div>
  </Card>
</template>
