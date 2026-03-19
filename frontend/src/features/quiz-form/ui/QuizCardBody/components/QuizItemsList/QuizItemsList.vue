<script setup lang="ts">
import { inject } from 'vue';

import { RadioField, RadioGroup, RadioInput } from '@shared/ui/radio';

import { QUIZ_FORM_CTX_KEY } from '../../../../config';
import type { QuizFormContext } from '../../../../model/types';

const ctx = inject<QuizFormContext>(QUIZ_FORM_CTX_KEY)!;
/**
 * TODO - replace h3 and p with quizTitle quizDescription components.
 * Also add an image. probably get them with cdn
 */
</script>

<template>
  <div class="flex flex-col">
    <div v-for="item in ctx.currentItems.value" :key="item.id">
      <h3 class="text-primary/70">
        {{ `${item.title.en}` }}
      </h3>

      <p>
        {{ item.description.en }}
      </p>

      <RadioField :name="item.id" :items="item.answers.en">
        <RadioGroup class="flex flex-col gap-4 pt-8">
          <RadioInput v-for="answer in item.answers.en" :key="answer.value" :name="answer.value" class="
            p-4
          " />
        </RadioGroup>
      </RadioField>
    </div>
  </div>
</template>
