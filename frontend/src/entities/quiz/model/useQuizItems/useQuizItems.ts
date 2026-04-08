import { useQuery } from '@tanstack/vue-query';

import { getQuizItems, quizQueries } from '@shared/api/quiz';

export const useQuizItems = () => {
  const {
    data: quizItems,
    refetch: refetchQuizItems,
    isFetching: isFetchingQuizItems,
    error: quizItemsError,
  } = useQuery({
    queryKey: quizQueries.quizItems(),
    queryFn: getQuizItems,
    staleTime: Infinity,
  });

  return {
    quizItems,
    isFetchingQuizItems,
    refetchQuizItems,
    quizItemsError,
  };
};
