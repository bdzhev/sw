<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { RouteName } from '@shared/lib/router';
import { Carousel } from '@shared/ui/carousel';
import { ConfirmModal } from '@shared/ui/confirm-modal';
import { ModalRoot } from '@shared/ui/modal';

import { useQuizData } from '@pages/builder/model/useQuizData';

import {
  clearQuizDraft,
  readQuizDraft,
  writeQuizDraft,
} from '../../../lib/quizDraft';
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
  <div class="flex h-full flex-col overflow-hidden">
    <QuizHeader
      class="mb-4 shrink-0 p-4"
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

  <ModalRoot v-model:open="isErrorModalOpen" is-controlled>
    <ConfirmModal
      type="basic"
      :modal-title="t('Failed to create character')"
      :modal-description="t('Something went wrong. Please try again.')"
      :confirm-button-text="t('Try again')"
      :is-loading="isCreating"
      @confirm="handleCreate"
    />
  </ModalRoot>
</template>
