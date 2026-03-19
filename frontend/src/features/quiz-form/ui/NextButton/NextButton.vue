<script setup lang="ts">
import { computed, inject } from 'vue';

import { Button } from '@shared/ui/button';

import { QUIZ_FORM_CTX_KEY } from '../../config';
import type { QuizFormContext } from '../../model/types';

import type { NextButtonProps } from './NextButton.props';

const props = defineProps<NextButtonProps>();

const ctx = inject<QuizFormContext>(QUIZ_FORM_CTX_KEY)!;

const isLastStep = computed(() => {
  return ctx.currentStep.value === 3;
});

const isStepComplete = computed(() => {
  return ctx.isCurrentStepComplete.value;
});

const handleNextButtonClick = () => {
  ctx.onSubmit();

  if (isLastStep.value) {
    ctx.changeIsFinalStepModalOpen(true);
  }
};
</script>

<template>
  <Button @click="handleNextButtonClick" :is-loading="ctx.isSendingResults.value" :is-disabled="!isStepComplete">
    <span v-if="isLastStep">{{ props.finishText }}</span>

    <span v-else>{{ props.nextText }}</span>
  </Button>
</template>
