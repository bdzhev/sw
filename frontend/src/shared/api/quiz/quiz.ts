import { http } from '@shared/lib/http';

import type {
  QuizData,
  QuizResults,
  SendQuizResultsOptions,
  GenerateStatsPayload,
  CharacterStats,
} from './types';

export const getQuizItems = () => {
  return http.get<QuizData>('/quiz/questions');
};

export const getQuizResults = (characterId: string) => {
  return http.get<QuizResults | null>(`/quiz/${characterId}`);
};

export const sendQuizResults = ({
  characterId,
  results,
}: SendQuizResultsOptions) => {
  return http.put<QuizResults>(`/quiz/${characterId}`, results);
};

export const generateStats = ({ characterId }: GenerateStatsPayload) => {
  return http.post<{ stats: CharacterStats }>(`/quiz/${characterId}/generate`);
};
