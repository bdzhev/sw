<script setup lang="ts">
import { computed, inject } from 'vue';

import { Button } from '@shared/ui/button';

import { QUIZ_FORM_CTX_KEY } from '../../config';
import type { QuizFormContext } from '../../model/types';

const ctx = inject<QuizFormContext>(QUIZ_FORM_CTX_KEY)!;

const handleReturnToPrevStepClick = () => {
  ctx.changeCurrentStep(ctx.currentStep.value - 1);
};

const isFirstStep = computed(() => {
  return ctx.currentStep.value === 0;
});
</script>

<template>
  <Button @click="handleReturnToPrevStepClick" variant="secondary" :is-disabled="isFirstStep">
    Go back
  </Button>
</template>
