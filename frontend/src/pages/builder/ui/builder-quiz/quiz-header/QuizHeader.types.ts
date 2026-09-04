import type { QuizProgressProps } from './quiz-progress';

export interface QuizHeaderProps {
  /**
   * Answered counts, as one object so the pair cannot arrive half-set. Omitted by
   * the loading and error states, which have no questions to count.
   */
  progress?: QuizProgressProps;
}
