import { http } from '@shared/lib/http';

import type { QuizData, GenerateStatsPayload, CharacterStats } from './types';

export const getQuizItems = () => {
  return http.get<QuizData>('/quiz/questions');
};

export const generateStats = ({ characterId, results }: GenerateStatsPayload) => {
  return http.post<{ stats: CharacterStats }>(`/quiz/${characterId}/generate`, {
    results,
  });
};
