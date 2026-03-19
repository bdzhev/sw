<script setup lang="ts">
import { computed, inject } from 'vue';

import { ProgressBar } from '@shared/ui/progress-bar';

import { LAST_STEP, QUIZ_FORM_CTX_KEY } from '../../config';
import type { QuizFormContext } from '../../model/types';

/**
 * TODO - move the progress bar ui to shared
 */
const ctx = inject<QuizFormContext>(QUIZ_FORM_CTX_KEY)!;

const totalSteps = LAST_STEP + 1;

const currentStep = computed(() => {
  return ctx.currentStep.value + 1;
});

const progress = computed(() => {
  return currentStep.value / totalSteps * 100;
});
</script>

<template>
  <ProgressBar :progress="progress">
    <p class="w-fit shrink-0">{{ `Step ${currentStep} out of ${LAST_STEP + 1}` }}</p>
  </ProgressBar>
</template>
