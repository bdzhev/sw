import { useQuery } from '@tanstack/vue-query';

import { getQuizResults, quizQueries } from '@shared/api/quiz';

export const useQuizResults = (characterId: string) => {
  const { data, isFetching } = useQuery({
    queryKey: quizQueries.quizResults(characterId),
    queryFn: async () => {
      const data = await getQuizResults(characterId);

      if (data === null) {
        return { progress: null, results: {} };
      }

      return data;
    },
  });

  return {
    quizResults: data,
    isFetchingQuizResults: isFetching,
  };
};
