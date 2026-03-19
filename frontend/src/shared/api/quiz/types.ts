import { LanguageCodes } from '@shared/config/locale';

enum Stats {
  STR = 'str',
  DEX = 'dex',
  WIS = 'wis',
  INT = 'int',
  CHA = 'cha',
  CON = 'con',
}

export type QuizCharacterStats = Exclude<Stats, Stats.CON>;

export type CharacterStats = Record<Stats, number>;

interface QuizAnswer {
  value: QuizCharacterStats;
  label: string;
}

export interface QuizItem {
  /**
   * Id of the question;
   */
  id: string;
  /**
   * Main text of the quiz question.
   */
  title: Record<LanguageCodes, string>;
  /**
   * Description of the question.
   */
  description: Record<LanguageCodes, string>;
  /**
   * Hint for the user.
   */
  hint?: Record<LanguageCodes, string>;
  /**
   * Available answers for the given question.
   */
  answers: Record<LanguageCodes, QuizAnswer[]>;
}

export interface QuizData {
  questions: QuizItem[];
}

export type QuizResults = Record<string, QuizCharacterStats>;

export interface QuizProgress {
  /**
   * Id of a form step that was properly filled to track
   * the progress of the user in filling the quiz form.
   * This value is increment-only.
   */
  progress: number;
  results: QuizResults;
}

export interface SendQuizResultsOptions {
  characterId: string;
  quizResults: QuizProgress;
}

export interface GenerateStatsPayload {
  results: Partial<QuizResults>;
  characterId: string;
}
