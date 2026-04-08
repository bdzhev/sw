<script setup lang="ts">
import { Card } from '@shared/ui/card';
import { RadioGroup, RadioInput, RadioField } from '@shared/ui/radio';

import type { QuizCardProps } from './QuizCard.props';

const props = defineProps<QuizCardProps>();
</script>

<template>
  <Card class="w-200">
    <RadioField :name="props.quizItem.id" :items="props.quizItem.answers.en">
      <RadioGroup>
        <RadioInput
          v-for="answer in props.quizItem.answers.en"
          :key="answer.value"
          :name="answer.value"
        />
      </RadioGroup>
    </RadioField>
  </Card>
</template>
