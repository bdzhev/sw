import { useMutation } from '@tanstack/vue-query';

import {
  generateStats as generateStatsRequest,
  quizQueries,
  type QuizResults,
} from '@shared/api/quiz';

export const useGenerateStats = (options: {
  characterId: string;
  onSuccess?: () => void;
}) => {
  const { characterId, onSuccess } = options;

  const { mutateAsync: generateStats, isPending: isGeneratingStats } =
    useMutation({
      mutationFn: async (results: Partial<QuizResults>) => {
        await generateStatsRequest({ characterId, results });
      },
      mutationKey: quizQueries.generateStats(characterId),
      onSuccess,
    });

  return { generateStats, isGeneratingStats };
};
