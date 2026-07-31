import { useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  characterQueries,
  CharacterStatus,
  type CharacterDetail,
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
        (old: CharacterDetail | undefined) => {
          if (!old) return old;

          return {
            ...old,
            character: { ...old.character, status: CharacterStatus.ACTIVE },
            sheet: {
              ...old.sheet,
              str: stats.str,
              dex: stats.dex,
              con: stats.con,
              intScore: stats.int,
              wis: stats.wis,
              cha: stats.cha,
            },
          };
        },
      );

      qc.invalidateQueries({ queryKey: characterQueries.characters() });

      onSuccess?.();
    },
    onError,
  });

  return { createCharacter, isCreating };
};
