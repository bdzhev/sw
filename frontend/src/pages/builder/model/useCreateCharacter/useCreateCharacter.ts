import { useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  characterQueries,
  CharacterStatus,
  type CharacterData,
} from '@shared/api/characters';
import {
  generateStats as generateStatsRequest,
  type QuizResults,
} from '@shared/api/quiz';

import { useBuilderProvider } from '../useBuilderProvider';
import type { UseCreateCharacterOptions } from './useCreateCharacter.types';

export const useCreateCharacter = (options?: UseCreateCharacterOptions) => {
  const { onError, onSuccess } = options || {};
  const { characterId } = useBuilderProvider()!;

  const qc = useQueryClient();

  const { mutate: createCharacter, isPending: isCreating } = useMutation({
    mutationFn: (results: QuizResults) => {
      return generateStatsRequest({ characterId, results });
    },
    onSuccess: ({ stats }) => {
      qc.setQueryData(
        characterQueries.character(characterId),
        (old: CharacterData | undefined) => {
          return old ? { ...old, stats, status: CharacterStatus.ACTIVE } : old;
        },
      );

      qc.invalidateQueries({ queryKey: characterQueries.characters() });

      onSuccess?.();
    },
    onError,
  });

  return { createCharacter, isCreating };
};
