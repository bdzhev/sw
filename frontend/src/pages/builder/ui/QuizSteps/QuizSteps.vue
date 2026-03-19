<script setup lang="ts">
import {
  QuizFormProvider,
  QuizCardBody,
  QuizCardHeader,
  QuizItemsList,
  QuizBodySkeleton,
  QuizCardHeaderTitle,
  QuizProgressBar,
  NextButton,
  BackButton,
  FinalStepModal,
} from '@features/quiz-form';

import { QuizStepsSkeleton } from '../QuizStepsSkeleton';

import type { QuizFormProps } from './QuizSteps.props';

const props = defineProps<QuizFormProps>();
</script>

<template>
  <div class="relative">
    <QuizFormProvider :character-id="props.characterId">
      <QuizCardHeader class="
        z-10 flex flex-col bg-bg-secondary/40 px-8 py-4 backdrop-blur-md
      ">
        <QuizCardHeaderTitle />
        <div class="flex flex-row justify-between">
          <div class="w-200">
            <QuizProgressBar />
          </div>

          <div class="flex shrink-0 flex-row gap-4 pl-4">
            <BackButton />

            <NextButton next-text="Continue" finish-text="Finish the quiz" />
          </div>
        </div>
      </QuizCardHeader>

      <QuizBodySkeleton class="w-full">
        <QuizStepsSkeleton />
      </QuizBodySkeleton>

      <QuizCardBody class="gap-8 p-8">
        <QuizItemsList class="gap-8" />
      </QuizCardBody>

      <FinalStepModal />
    </QuizFormProvider>
  </div>
</template>
