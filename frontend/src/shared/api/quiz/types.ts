import { LanguageCodes } from "@shared/config/locale";

enum Stats {
  STR = "str",
  DEX = "dex",
  WIS = "wis",
  INT = "int",
  CHA = "cha",
  CON = "con",
}

export const QUIZ_STATS = ["str", "dex", "wis", "int", "cha"] as const;

export type QuizCharacterStats = (typeof QUIZ_STATS)[number];

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

export interface SendQuizResultsOptions {
  characterId: string;
  results: QuizResults;
}

export interface GenerateStatsPayload {
  results: Partial<QuizResults>;
  characterId: string;
}
