<script setup lang="ts">
import { inject } from 'vue';

import { ConfirmModal } from '@shared/ui/confirm-modal';
import { ModalRoot } from '@shared/ui/modal';

import { useGenerateStats } from '@entities/quiz';

import { QUIZ_FORM_CTX_KEY } from '../../config';
import type { QuizFormContext } from '../../model/types';

const ctx = inject<QuizFormContext>(QUIZ_FORM_CTX_KEY)!;

const { generateStats, isGeneratingStats } = useGenerateStats({ characterId: ctx.characterId });

const handleConfirm = async () => {
  try {
    generateStats(ctx.formValues.value);
    ctx.changeIsFinalStepModalOpen(false);
  } catch {
    // handle with error toast
  }
}
</script>

<template>
  <ModalRoot v-model:open="ctx.isFinalStepModalOpen.value" is-controlled>
    <ConfirmModal modal-title="Proceed to generation?" modal-description="You won't be able to revert the changes"
      @confirm="handleConfirm" :is-loading="isGeneratingStats" />
  </ModalRoot>
</template>
