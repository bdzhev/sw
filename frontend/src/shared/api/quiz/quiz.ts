import { http } from '@shared/lib/http';

import type {
  QuizData,
  QuizProgress,
  SendQuizResultsOptions,
  GenerateStatsPayload,
  CharacterStats,
} from './types';

export const getQuizItems = (): Promise<QuizData> =>
  http.get<QuizData>('/quiz/questions');

export const getQuizResults = (characterId: string): Promise<QuizProgress | null> =>
  http.get<QuizProgress | null>(`/quiz/${characterId}`);

export const sendQuizResults = ({ characterId, quizResults }: SendQuizResultsOptions): Promise<QuizProgress> =>
  http.put<QuizProgress>(`/quiz/${characterId}`, quizResults);

export const generateStats = ({ characterId }: GenerateStatsPayload): Promise<{ stats: CharacterStats }> =>
  http.post<{ stats: CharacterStats }>(`/quiz/${characterId}/generate`);
