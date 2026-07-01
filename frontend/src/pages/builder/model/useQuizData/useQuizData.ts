import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import { CharacterStatus } from '@shared/api/characters';
import { RouteName } from '@shared/lib/router';

import { useCharacter } from '@entities/characters';
import { useQuizItems } from '@entities/quiz';

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
  const { isFetchingQuizItems, quizItems, refetchQuizItems, quizItemsError } =
    useQuizItems();

  watch(isCharacterNotFound, (notFound) => {
    if (notFound) {
      router.replace({ name: RouteName.APP_HOME });
    }
  });

  // Guard: an already-created (active) character has no quiz left to take —
  // send the user to its character page instead of the builder.
  watch(
    character,
    (value) => {
      if (value?.status === CharacterStatus.ACTIVE) {
        router.replace({
          name: RouteName.APP_CHARACTER,
          params: { id: ctx.characterId },
        });
      }
    },
    { immediate: true },
  );

  const handleTryAgainClick = () => {
    if (characterError) {
      refetchCharacter();
    }

    if (quizItemsError) {
      refetchQuizItems();
    }
  };

  const hasError = computed(() => {
    return Boolean(quizItemsError.value || characterError.value);
  });

  const isQuizDataLoading = computed(() => {
    return (
      isFetchingCharacter.value ||
      isFetchingQuizItems.value ||
      !Boolean(character.value) ||
      !Boolean(quizItems.value)
    );
  });

  return {
    isQuizDataLoading,
    character,
    quizItems,
    hasError,
    onTryAgainClick: handleTryAgainClick,
  };
};
