<script setup lang="ts">
import { computed, watch } from 'vue';

import type { QuizResults } from '@shared/api/quiz';
import { Carousel } from '@shared/ui/carousel';

import { useQuizData } from '@pages/builder/model/useQuizData';

import { readQuizDraft, writeQuizDraft } from '../../../lib/quizDraft';
import { useBuilderProvider } from '../../../model/useBuilderProvider';
import { useCreateCharacter } from '../../../model/useCreateCharacter';
import { useQuizForm } from '../../../model/useQuizForm';

import { QuizCard } from './quiz-card';
import { QuizHeader } from './quiz-header';

const { characterId } = useBuilderProvider()!;

const { character, quizItems } = useQuizData();

if (!quizItems.value || !character.value) {
  throw new Error('QuizData not loaded');
}

const form = useQuizForm({
  initialValues: readQuizDraft(characterId),
  items: quizItems.value.questions,
});

// Persist answers locally so a page reload doesn't lose progress.
watch(
  form.values,
  (values) => {
    writeQuizDraft(characterId, values as QuizResults);
  },
  { deep: true },
);

const isFormValid = computed(() => {
  return form.meta.value.valid;
});

const { createCharacter, isCreating } = useCreateCharacter();

// handleSubmit re-validates, so this only fires once every question is answered.
const onCreate = form.handleSubmit((values) => {
  createCharacter(values as QuizResults).catch(() => {
    /* failure is reflected in the mutation state; stay on the builder */
  });
});
</script>

<template>
  <QuizHeader
    :is-valid="isFormValid"
    :is-creating="isCreating"
    @create="onCreate"
  />

  <Carousel>
    <QuizCard
      v-for="item in quizItems.questions"
      :key="item.id"
      :quiz-item="item"
    />
  </Carousel>
</template>
