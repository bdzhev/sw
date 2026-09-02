<script setup lang="ts">
import { Skeleton } from '@shared/ui/skeleton';

import { QuizHeader } from '../quiz-header';
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <QuizHeader class="md:mb-4" />

    <div class="relative flex min-h-0 flex-1 flex-row items-center justify-center py-4">
      <div class="absolute -left-8 z-0 hidden h-3/4 w-150 opacity-50 md:block lg:w-200">
        <Skeleton class="rounded-xl" />
      </div>

      <div
        class="z-10 h-full max-h-180 w-80 bg-bg-primary sm:w-128 md:w-160 lg:w-200 xl:w-240"
      >
        <Skeleton class="rounded-xl" />
      </div>

      <div class="absolute -right-8 z-0 hidden h-3/4 w-150 opacity-50 md:block lg:w-200">
        <Skeleton class="rounded-xl" />
      </div>
    </div>
  </div>
</template>
