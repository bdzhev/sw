import type { QuizItem } from '@shared/api/quiz';

export type QuizCardProps = {
  quizItem: QuizItem;
  isPicked: boolean;
};
