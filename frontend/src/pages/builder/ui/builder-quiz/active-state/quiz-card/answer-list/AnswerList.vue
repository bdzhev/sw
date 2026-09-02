<script setup lang="ts">
import { RadioGroup, RadioInput } from '@shared/ui/radio';

import type { AnswerListProps } from './AnswerList.types';

const props = defineProps<AnswerListProps>();
</script>

<template>
  <RadioGroup class="flex flex-col gap-4 p-2">
    <RadioInput
      v-for="answer in props.answers"
      :key="answer.value"
      :name="String(answer.value)"
      class="min-h-12 p-4"
    />
  </RadioGroup>
</template>
