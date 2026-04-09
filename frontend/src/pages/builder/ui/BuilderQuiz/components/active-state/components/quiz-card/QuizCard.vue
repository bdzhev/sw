<script setup lang="ts">
import { computed } from 'vue';

import { ImageFolder } from '@shared/lib/assets';
import { fmt } from '@shared/lib/format';
import { Card, CardHeader, HeaderTitle } from '@shared/ui/card';
import { Image } from '@shared/ui/image';
import { RadioGroup, RadioInput, RadioField } from '@shared/ui/radio';
import { Text } from '@shared/ui/text';

import { useCharacter } from '@entities/characters';

import { useBuilderProvider } from '../../../../../../model/useBuilderProvider';

import type { QuizCardProps } from './QuizCard.props';

const props = defineProps<QuizCardProps>();

const ctx = useBuilderProvider()!;

const { character } = useCharacter({ id: ctx.characterId });

if (!character.value) {
  throw new Error('Quiz Card requires character data');
}

const formattedInputItems = computed(() => {
  return props.quizItem.answers.en.map((answer) => {
    return {
      ...answer,
      label: fmt(answer.label, { characterName: character.value.name }),
    };
  });
});
</script>

<template>
  <Card class="relative h-180 w-280 p-10">
    <Image
      :folder="ImageFolder.Quiz"
      name="test-image-carousel"
      class="absolute top-0 h-80 w-80 translate-x-full opacity-20"
    />

    <CardHeader class="mb-36">
      <HeaderTitle>{{ props.quizItem.title.en }}</HeaderTitle>
    </CardHeader>

    <Text class="mb-8">
      {{
        fmt(props.quizItem.description.en, { characterName: character.name })
      }}
    </Text>

    <RadioField :name="props.quizItem.id" :items="formattedInputItems">
      <RadioGroup class="flex flex-col gap-4">
        <RadioInput
          v-for="answer in props.quizItem.answers.en"
          :key="answer.value"
          :name="answer.value"
          class="min-h-12 p-4"
        />
      </RadioGroup>
    </RadioField>
  </Card>
</template>
