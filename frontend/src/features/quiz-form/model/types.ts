import type { ComputedRef, Ref } from 'vue';

import type { QuizCharacterStats, QuizItem } from '@shared/api/quiz';

export interface QuizFormContext {
  characterId: string;
  currentStep: Ref<number>;
  changeCurrentStep: (newStep: number) => void;
  isSendingResults: Ref<boolean>;
  isStepLoading: ComputedRef<boolean>;
  currentItems: Ref<QuizItem[]>;
  onSubmit: () => void;
  isCurrentStepComplete: ComputedRef<boolean>;
  isFinalStepModalOpen: Ref<boolean>;
  changeIsFinalStepModalOpen: (isOpen: boolean) => void;
  formValues: ComputedRef<Partial<Record<string, QuizCharacterStats>>>;
}
