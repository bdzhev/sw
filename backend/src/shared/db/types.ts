/**
 * The five stats a quiz *answer* can point at. CON is deliberately absent: no
 * question maps to it, so `quiz.stats.ts` synthesises it from `baseConWeight`.
 * Adding it here would double-count against that fallback and skew every
 * generated character. The six-value set lives in `quiz.stats.ts` as `Stat`.
 */
export enum QuizAnswerStat {
  Str = 'str',
  Dex = 'dex',
  Wis = 'wis',
  Int = 'int',
  Cha = 'cha',
}

export type QuizResults = Record<string, QuizAnswerStat>;
