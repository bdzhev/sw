<script setup lang="ts">
import { Skeleton } from '@shared/ui/skeleton';

import { quizItemsCount, quizAnswersCount } from '../../config';
</script>

<template>
  <div class="flex h-full w-full flex-col gap-8 p-8">
    <div class="flex flex-col gap-4" v-for="n in quizItemsCount" :key="`quiz-skeleton-item-${n}`">
      <div class="h-6 w-60">
        <Skeleton class="rounded-sm" />
      </div>

      <div class="flex flex-col gap-2">
        <div class="h-4 w-80">
          <Skeleton class="rounded-sm" />
        </div>

        <div class="h-4 w-100">
          <Skeleton class="rounded-sm" />
        </div>

        <div class="h-4 w-70">
          <Skeleton class="rounded-sm" />
        </div>

        <div class="flex flex-col gap-4 pt-8">
          <div class="rounded-sm p-4 ring-2 ring-secondary/30" v-for="n in quizAnswersCount"
            :key="`quiz-item-answer-skeleton${n}`">
            <div class="h-[21px] w-140">
              <Skeleton class="rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
