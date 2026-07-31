import { z } from 'zod';

import { QuizAnswerStat } from '@/shared/db/types';

/**
 * An answer points at one of five stats. CON is absent on purpose — no question
 * maps to it, so `quiz.stats.ts` synthesises it; accepting it here would
 * double-count against that fallback and skew the generated scores.
 */
export const generateStatsSchema = z.object({
  results: z.record(z.string(), z.enum(QuizAnswerStat)).refine(
    (results) => {
      return Object.keys(results).length > 0;
    },
    { message: 'At least one answer is required' }
  ),
});

export type GenerateStatsInput = z.infer<typeof generateStatsSchema>;
