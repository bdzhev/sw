<script setup lang="ts">
import { provide } from 'vue';

import { QUIZ_FORM_CTX_KEY } from '../../config';
import type { QuizFormContext } from '../../model/types';
import { useQuizFlow } from '../../model/useQuizFlow';

import type { QuizFormProviderProps } from './QuizFormProvider.props';


const props = defineProps<QuizFormProviderProps>();

const {
  currentStep,
  changeCurrentStep,
  isStepLoading,
  currentItems,
  onSubmit,
  isCurrentStepComplete,
  isSendingResults,
  isFinalStepModalOpen,
  changeIsFinalStepModalOpen,
  formValues,
} = useQuizFlow({ characterId: props.characterId });

provide<QuizFormContext>(QUIZ_FORM_CTX_KEY, {
  characterId: props.characterId,
  changeCurrentStep,
  currentStep,
  isSendingResults,
  isStepLoading,
  currentItems,
  onSubmit,
  isCurrentStepComplete,
  isFinalStepModalOpen,
  changeIsFinalStepModalOpen,
  formValues,
});
</script>

<template>
  <slot />
</template>
