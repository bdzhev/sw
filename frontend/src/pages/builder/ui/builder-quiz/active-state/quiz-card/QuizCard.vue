<script setup lang="ts">
import { computed } from 'vue';

import { fmt } from '@shared/lib/format';
import { useBreakpoint } from '@shared/lib/ui';
import { Card } from '@shared/ui/card';
import { RadioField } from '@shared/ui/radio';
import { ScrollArea } from '@shared/ui/scroll-area';

import { useCharacter } from '@entities/characters';

import { useBuilderProvider } from '../../../../model/useBuilderProvider';
import { AnswerList } from './answer-list';
import { CardIntro } from './card-intro';
import type { QuizCardProps } from './QuizCard.types';

const props = defineProps<QuizCardProps>();

const ctx = useBuilderProvider()!;

/** Which element is the scroller is not something a Tailwind variant can say. */
const { isMobile } = useBreakpoint();

const { character } = useCharacter({ id: ctx.characterId });

if (!character.value) {
  throw new Error('Quiz Card requires character data');
}

const characterName = computed(() => {
  return character.value.character.name;
});

const description = computed(() => {
  return fmt(props.quizItem.description.ru, { characterName: characterName.value });
});

const formattedInputItems = computed(() => {
  return props.quizItem.answers.ru.map((answer) => {
    return {
      ...answer,
      label: fmt(answer.label, { characterName: characterName.value }),
    };
  });
});
</script>

<template>
  <Card
    :class="[
      `relative flex h-full max-h-180 w-80 shrink-0 flex-col gap-4 p-4 transition-all duration-200 sm:w-128 md:w-160 md:flex-row md:gap-10 md:p-10 lg:w-200 xl:w-240`,
      props.isPicked && 'bg-accent-secondary/20',
    ]"
    variant="outline"
  >
    <!-- Above the branch on purpose: vee-validate drops an unmounted field's path. -->
    <RadioField :name="props.quizItem.id" :items="formattedInputItems">
      <ScrollArea v-if="isMobile" class="min-h-0 flex-1" should-fade>
        <div class="flex flex-col gap-4">
          <CardIntro :title="props.quizItem.title.ru" :description="description" />

          <AnswerList :answers="formattedInputItems" />
        </div>
      </ScrollArea>

      <template v-else>
        <CardIntro :title="props.quizItem.title.ru" :description="description" />

        <div class="flex min-h-0 flex-1 flex-col">
          <ScrollArea class="h-full" should-fade>
            <AnswerList :answers="formattedInputItems" />
          </ScrollArea>
        </div>
      </template>
    </RadioField>
  </Card>
</template>
