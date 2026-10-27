<script setup lang="ts">
import { TryAgainCard } from '@widgets/try-again-card';

import { QuizHeader } from '../quiz-header';
import type { ErrorStateProps } from './ErrorState.types';

const props = defineProps<ErrorStateProps>();
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <QuizHeader class="md:mb-4" />

    <div
      class="flex min-h-0 flex-1 items-center justify-center overflow-y-auto page-x py-4"
    >
      <TryAgainCard
        title="Damn"
        decription="Something went wrong"
        @try-again-click="props.onTryAgainClick"
      />
    </div>
  </div>
</template>
