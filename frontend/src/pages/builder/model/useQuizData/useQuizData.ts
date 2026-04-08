import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import { RouteName } from '@shared/lib/router';

import { useCharacter } from '@entities/characters';
import { useQuizItems, useQuizResults } from '@entities/quiz';

import { useBuilderProvider } from '../../model/useBuilderProvider';

import type { UseQuizDataOptions } from './useQuizData.types';

export const useQuizData = (options?: UseQuizDataOptions) => {
  const { shouldRefetchOnMount = false } = options || {};

  const router = useRouter();

  const ctx = useBuilderProvider()!;

  const {
    isFetchingCharacter,
    character,
    refetchCharacter,
    characterError,
    isCharacterNotFound,
  } = useCharacter({ id: ctx.characterId, shouldRefetchOnMount });
  const {
    isFetchingQuizResults,
    quizResults,
    refetchQuizResults,
    quizResultsError,
  } = useQuizResults({ characterId: ctx.characterId, shouldRefetchOnMount });
  const { isFetchingQuizItems, quizItems, refetchQuizItems, quizItemsError } =
    useQuizItems();

  watch(isCharacterNotFound, (notFound) => {
    if (notFound) {
      router.replace({ name: RouteName.APP_HOME });
    }
  });

  const handleTryAgainClick = () => {
    if (characterError) {
      refetchCharacter();
    }

    if (quizResultsError) {
      refetchQuizResults();
    }

    if (quizItemsError) {
      refetchQuizItems();
    }
  };

  const hasError = computed(() => {
    return Boolean(
      quizItemsError.value || characterError.value || quizResultsError.value,
    );
  });

  const isQuizDataLoading = computed(() => {
    return (
      isFetchingCharacter.value ||
      isFetchingQuizItems.value ||
      isFetchingQuizResults.value ||
      !Boolean(character.value) ||
      !Boolean(quizItems.value) ||
      !Boolean(quizResults.value)
    );
  });

  return {
    isQuizDataLoading,
    character,
    quizResults,
    quizItems,
    hasError,
    onTryAgainClick: handleTryAgainClick,
  };
};
