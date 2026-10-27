<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { RouteName } from '@shared/lib/router';
import { Button } from '@shared/ui/button';
import { Carousel } from '@shared/ui/carousel';
import { ConfirmDialog } from '@shared/ui/confirm-dialog';
import { DialogRoot } from '@shared/ui/dialog';

import { useQuizData } from '@pages/builder/model/useQuizData';

import { clearQuizDraft, readQuizDraft, writeQuizDraft } from '../../../lib/quizDraft';
import { useBuilderProvider } from '../../../model/useBuilderProvider';
import { useCreateCharacter } from '../../../model/useCreateCharacter';
import { useQuizForm } from '../../../model/useQuizForm';
import { QuizHeader } from '../quiz-header';
import { QuizCard } from './quiz-card';

const { t } = useI18n();

const { characterId } = useBuilderProvider()!;
const router = useRouter();
const isErrorModalOpen = ref(false);

const { character, quizItems } = useQuizData();

if (!quizItems.value || !character.value) {
  throw new Error('QuizData not loaded');
}

const questions = quizItems.value.questions;

const form = useQuizForm({
  initialValues: readQuizDraft(characterId),
  items: questions,
});

watch(
  form.values,
  (values) => {
    writeQuizDraft(characterId, values);
  },
  { deep: true },
);

const handleCreateCharacterError = () => {
  isErrorModalOpen.value = true;
};

const handleCreateCharacterSuccess = () => {
  router.replace({
    name: RouteName.APP_CHARACTER,
    params: { id: characterId },
  });

  clearQuizDraft(characterId);
};

const isFormValid = computed(() => {
  return form.meta.value.valid;
});

/** Same predicate the cards use for their picked tint, counted instead. */
const progress = computed(() => {
  const answered = questions.filter((item) => {
    return Boolean(form.values[item.id]);
  }).length;

  return { answered, total: questions.length };
});

const { createCharacter, isCreating } = useCreateCharacter({
  onError: handleCreateCharacterError,
  onSuccess: handleCreateCharacterSuccess,
});

const handleCreate = form.handleSubmit((values) => {
  createCharacter(values);
});
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <QuizHeader class="md:mb-4" :progress="progress">
      <Button
        type="button"
        class="min-h-11 md:min-h-0"
        :is-disabled="!isFormValid || isCreating"
        :is-loading="isCreating"
        @click="handleCreate"
      >
        {{ t('Create character') }}
      </Button>
    </QuizHeader>

    <div class="min-h-0 flex-1">
      <Carousel>
        <QuizCard
          v-for="item in questions"
          :key="item.id"
          :quiz-item="item"
          :is-picked="Boolean(form.values[item.id])"
        />
      </Carousel>
    </div>
  </div>

  <DialogRoot v-model:open="isErrorModalOpen">
    <ConfirmDialog
      type="basic"
      :dialog-title="t('Failed to create character')"
      :dialog-description="t('Something went wrong. Please try again.')"
      :confirm-button-text="t('Try again')"
      :is-loading="isCreating"
      @confirm="handleCreate"
    />
  </DialogRoot>
</template>
