import type { QuizItem, QuizResults } from "@shared/api/quiz";

export interface UseQuizFormOptions {
  initialValues: QuizResults;
  items: QuizItem[];
}