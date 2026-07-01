import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';

import {
  characterQueries,
  CharacterStatus,
  type CharacterData,
} from '@shared/api/characters';
import {
  generateStats as generateStatsRequest,
  type QuizResults,
} from '@shared/api/quiz';
import { RouteName } from '@shared/lib/router';

import { clearQuizDraft } from '../../lib/quizDraft';
import { useBuilderProvider } from '../useBuilderProvider';

export const useCreateCharacter = () => {
  const { characterId } = useBuilderProvider()!;

  const router = useRouter();
  const qc = useQueryClient();

  const { mutateAsync: createCharacter, isPending: isCreating } = useMutation({
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

      clearQuizDraft(characterId);

      router.replace({
        name: RouteName.APP_CHARACTER,
        params: { id: characterId },
      });
    },
  });

  return { createCharacter, isCreating };
};
