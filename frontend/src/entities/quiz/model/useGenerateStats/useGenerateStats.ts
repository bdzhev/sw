import { useMutation } from '@tanstack/vue-query';

import { CharacterStatus } from '@shared/api/characters';
import {
  generateStats as generateStatsRequest,
  quizQueries,
  type QuizResults,
} from '@shared/api/quiz';

import { useCharacterQueryCache } from '@entities/characters';

export const useGenerateStats = (options: {
  characterId: string;
  onSuccess?: () => void;
}) => {
  const { characterId, onSuccess } = options;
  const { updateCharacterCache } = useCharacterQueryCache();

  const { mutateAsync: generateStats, isPending: isGeneratingStats } =
    useMutation({
      mutationFn: async (results: Partial<QuizResults>) => {
        return await generateStatsRequest({ characterId, results });
      },
      mutationKey: quizQueries.generateStats(characterId),
      onSuccess: (data) => {
        updateCharacterCache(characterId, {
          stats: data.stats,
          status: CharacterStatus.ACTIVE,
        });
        onSuccess?.();
      },
    });

  return { generateStats, isGeneratingStats };
};
