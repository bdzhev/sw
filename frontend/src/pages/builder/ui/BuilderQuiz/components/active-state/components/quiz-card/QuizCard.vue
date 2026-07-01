<script setup lang="ts">
import { useIsFieldDirty } from 'vee-validate';
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

const isDirty = useIsFieldDirty(props.quizItem.id);

const formattedInputItems = computed(() => {
  return props.quizItem.answers.ru.map((answer) => {
    return {
      ...answer,
      label: fmt(answer.label, { characterName: character.value.name }),
    };
  });
});
</script>

<template>
  <Card
    :class="[
      'relative h-180 w-270 p-10 transition-all duration-200',
      isDirty && 'bg-accent-secondary/20',
    ]"
    variant="outline"
  >
    <div
      opacity-20
      class="absolute top-0 h-80 w-80 translate-x-full fade-bottom opacity-20"
    >
      <Image :folder="ImageFolder.Quiz" name="test-image-carousel" />
    </div>

    <CardHeader class="mb-36">
      <HeaderTitle>{{ props.quizItem.title.ru }}</HeaderTitle>
    </CardHeader>

    <Text class="mb-8">
      {{
        fmt(props.quizItem.description.ru, { characterName: character.name })
      }}
    </Text>

    <RadioField :name="props.quizItem.id" :items="formattedInputItems">
      <RadioGroup class="flex flex-col gap-4">
        <RadioInput
          v-for="answer in props.quizItem.answers.ru"
          :key="answer.value"
          :name="answer.value"
          class="min-h-12 p-4"
        />
      </RadioGroup>
    </RadioField>
  </Card>
</template>
