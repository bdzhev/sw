import { useForm, useFormValues } from 'vee-validate';
import { computed, ref, watch } from 'vue';

import {
  useQuizItems,
  useQuizResults,
  useSendQuizResults,
} from '@entities/quiz';

import { DEFAULT_QUIZ_STEP, LAST_STEP } from '../../config';
import { getQuizProgress } from '../../lib';

import type { UseQuizFlowOptions } from './useQuizFlow.types';
import type { QuizCharacterStats } from '@shared/api/quiz';

export const useQuizFlow = (options: UseQuizFlowOptions) => {
  const { characterId } = options;

  const isInited = ref(false);

  const currentStep = ref(DEFAULT_QUIZ_STEP);

  const changeCurrentStep = (newStep: number) => {
    currentStep.value = Math.min(newStep, LAST_STEP);
  };

  const isFinalStepModalOpen = ref(false);

  const changeIsFinalStepModalOpen = (val: boolean) => {
    isFinalStepModalOpen.value = val;
  };

  const { quizResults, isFetchingQuizResults } = useQuizResults(characterId);
  const { sendQuizResults, isSendingQuizResults } = useSendQuizResults({
    characterId,
  });
  const { quizItems, areQuizItemsFetching } = useQuizItems();

  const {
    handleSubmit: submitForm,
    meta,
    resetForm,
  } = useForm({
    initialValues: {},
    keepValuesOnUnmount: true,
  });

  const values = useFormValues<Record<string, QuizCharacterStats>>();

  /**
   * We fetch once, then we mutate the cache. On each initialization
   * of the quiz form it will be using the value from the cache.
   */
  watch(
    [isFetchingQuizResults, quizResults, isInited],
    () => {
      if (isFetchingQuizResults.value || !quizResults.value || isInited.value) {
        return;
      }

      if (quizResults.value.progress === null) {
        changeCurrentStep(DEFAULT_QUIZ_STEP);
      } else {
        resetForm({ values: quizResults.value.results });
        changeCurrentStep(quizResults.value.progress + 1);
      }

      isInited.value = true;
    },
    { immediate: true },
  );

  const QUESTIONS_PER_STEP = 4;

  const currentItems = computed(() => {
    const start = currentStep.value * QUESTIONS_PER_STEP;
    return (quizItems.value?.questions ?? []).slice(start, start + QUESTIONS_PER_STEP);
  });

  const isCurrentStepComplete = computed(() => {
    if (!currentItems.value.length) return false;
    return currentItems.value.every((q) => Boolean(values.value[q.id]));
  });

  const handleSubmit = () => {
    if (!quizResults.value || !isCurrentStepComplete.value) {
      return;
    }

    submitForm(async (values) => {
      const progress = getQuizProgress(
        quizResults.value.progress,
        currentStep.value,
      );
      /**
       * if last step + dialog preventer.
       */
      if (currentStep.value === LAST_STEP) {
        await sendQuizResults({ progress, results: values });

        return;

        /**
         * change the ui to final stage
         * send the post request to mark as active
         */
      }

      /**
       * Non final steps logic.
       */
      if (meta.value.dirty) {
        await sendQuizResults({ progress, results: values });
      }

      changeCurrentStep(currentStep.value + 1);
    })();
  };

  const isStepLoading = computed(() => {
    return areQuizItemsFetching.value || isFetchingQuizResults.value;
  });

  return {
    currentStep,
    changeCurrentStep,
    isFinalStepModalOpen,
    changeIsFinalStepModalOpen,
    formValues: values,
    isStepLoading,
    isCurrentStepComplete,
    currentItems,
    onSubmit: handleSubmit,
    isSendingResults: isSendingQuizResults,
  };
};
