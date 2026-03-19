import { useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  quizQueries,
  sendQuizResults as sendQuizResultsRequest,
  type QuizProgress,
} from '@shared/api/quiz';

import type { UseSendQuizResultsOptions } from './types';

export const useSendQuizResults = (options: UseSendQuizResultsOptions) => {
  const { characterId, onSuccess } = options;

  const qc = useQueryClient();

  const { mutateAsync: sendQuizResults, isPending } = useMutation({
    mutationFn: async (quizResults: QuizProgress) => {
      await sendQuizResultsRequest({ characterId, quizResults });

      return quizResults;
    },
    onSuccess: (data) => {
      qc.setQueryData(
        quizQueries.quizResults(characterId),
        (oldData: QuizProgress) => {
          return oldData ? { ...oldData, ...data } : data;
        },
      );

      onSuccess?.();
    },
  });

  return { sendQuizResults, isSendingQuizResults: isPending };
};
