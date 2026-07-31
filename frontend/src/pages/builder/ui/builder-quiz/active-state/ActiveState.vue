<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { RouteName } from '@shared/lib/router';
import { Carousel } from '@shared/ui/carousel';
import { ConfirmDialog } from '@shared/ui/confirm-dialog';
import { DialogRoot } from '@shared/ui/dialog';

import { useQuizData } from '@pages/builder/model/useQuizData';

import { clearQuizDraft, readQuizDraft, writeQuizDraft } from '../../../lib/quizDraft';
import { useBuilderProvider } from '../../../model/useBuilderProvider';
import { useCreateCharacter } from '../../../model/useCreateCharacter';
import { useQuizForm } from '../../../model/useQuizForm';
import { QuizCard } from './quiz-card';
import { QuizHeader } from './quiz-header';

const { t } = useI18n();

const { characterId } = useBuilderProvider()!;
const router = useRouter();
const isErrorModalOpen = ref(false);

const { character, quizItems } = useQuizData();

if (!quizItems.value || !character.value) {
  throw new Error('QuizData not loaded');
}

const form = useQuizForm({
  initialValues: readQuizDraft(characterId),
  items: quizItems.value.questions,
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

const { createCharacter, isCreating } = useCreateCharacter({
  onError: handleCreateCharacterError,
  onSuccess: handleCreateCharacterSuccess,
});

const handleCreate = form.handleSubmit((values) => {
  createCharacter(values);
});
</script>

<template>
  <!-- No `h-full` below md: `main` has no definite height there, so it would
       resolve to auto and collapse the carousel's own height chain. -->
  <div
    class="flex min-h-[calc(100svh-var(--spacing-mobile-bar))] flex-col md:h-full md:min-h-0 md:overflow-hidden"
  >
    <QuizHeader
      class="shrink-0 md:mb-4"
      :is-valid="isFormValid"
      :is-creating="isCreating"
      @create="handleCreate"
    />

    <div class="min-h-0 flex-1">
      <Carousel>
        <QuizCard
          v-for="item in quizItems.questions"
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
