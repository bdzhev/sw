import { useQuery } from '@tanstack/vue-query';

import { getQuizResults, quizQueries } from '@shared/api/quiz';

import type { UseQuizResultsOptions } from './useQuizResults.types';

export const useQuizResults = (options: UseQuizResultsOptions) => {
  const { characterId, shouldRefetchOnMount = false } = options || {};

  const {
    data: quizResults,
    isFetching: isFetchingQuizResults,
    refetch: refetchQuizResults,
    error: quizResultsError,
  } = useQuery({
    queryKey: quizQueries.quizResults(characterId),
    queryFn: async () => {
      return await getQuizResults(characterId);
    },
    refetchOnMount: shouldRefetchOnMount,
  });

  return {
    quizResults,
    isFetchingQuizResults,
    refetchQuizResults,
    quizResultsError,
  };
};
