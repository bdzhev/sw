<script setup lang="ts">
import { computed } from 'vue';

import { ImageFolder } from '@shared/lib/assets';
import { fmt } from '@shared/lib/format';
import { Card, CardHeader, HeaderTitle } from '@shared/ui/card';
import { Image } from '@shared/ui/image';
import { RadioGroup, RadioInput, RadioField } from '@shared/ui/radio';
import { ScrollArea } from '@shared/ui/scroll-area';
import { Text } from '@shared/ui/text';

import { useCharacter } from '@entities/characters';

import { useBuilderProvider } from '../../../../model/useBuilderProvider';

import type { QuizCardProps } from './QuizCard.types';

const props = defineProps<QuizCardProps>();

const ctx = useBuilderProvider()!;

const { character } = useCharacter({ id: ctx.characterId });

if (!character.value) {
  throw new Error('Quiz Card requires character data');
}

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
      `
        relative flex h-full max-h-180 w-72 shrink-0 flex-col gap-4 p-4
        transition-all duration-200
        sm:w-128
        md:w-160 md:flex-row md:gap-10 md:p-10
        lg:w-200
        xl:w-240
        2xl:w-270
      `,
      props.isPicked && 'bg-accent-secondary/20',
    ]"
    variant="outline"
  >
    <div class="flex shrink-0 flex-col gap-4 overflow-hidden md:w-2/5">
      <Image
        :folder="ImageFolder.Quiz"
        name="test-image-carousel"
        class="h-40 w-full shrink-0 object-cover md:h-1/2"
      />

      <CardHeader>
        <HeaderTitle>{{ props.quizItem.title.ru }}</HeaderTitle>
      </CardHeader>

      <Text>
        {{
          fmt(props.quizItem.description.ru, { characterName: character.name })
        }}
      </Text>
    </div>

    <div class="flex min-h-0 flex-1 flex-col">
      <RadioField :name="props.quizItem.id" :items="formattedInputItems">
        <ScrollArea class="h-full" should-fade>
          <RadioGroup class="flex flex-col gap-4 p-2">
            <RadioInput
              v-for="answer in formattedInputItems"
              :key="answer.value"
              :name="answer.value"
              class="min-h-12 p-4"
            />
          </RadioGroup>
        </ScrollArea>
      </RadioField>
    </div>
  </Card>
</template>
