import { useQuery } from '@tanstack/vue-query';

import { getQuizItems, quizQueries } from '@shared/api/quiz';

export const useQuizItems = () => {
  const { data: quizItems, isFetching: areQuizItemsFetching } = useQuery({
    queryKey: quizQueries.quizItems(),
    queryFn: getQuizItems,
    staleTime: Infinity,
  });

  return {
    quizItems,
    areQuizItemsFetching,
  };
};
