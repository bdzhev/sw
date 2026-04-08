<script setup lang="ts">
import { Carousel } from '@shared/ui/carousel';

import { useQuizData } from '@pages/builder/model/useQuizData';

import { useQuizForm } from '../../../../model/useQuizForm';

import { QuizCard } from './components';

const { character, quizItems, quizResults } = useQuizData();

if (!quizResults.value || !quizItems.value || !character) {
  throw new Error('QuizData not loaded');
}

useQuizForm({
  initialValues: quizResults.value,
  items: quizItems.value.questions,
});
</script>

<template>
  <Carousel>
    <QuizCard
      v-for="item in quizItems.questions"
      :key="item.id"
      :quiz-item="item"
    />
  </Carousel>
</template>
