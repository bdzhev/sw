import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { DEMO_STATS } from '../../config/stats';

export const demoStatsSchema = toTypedSchema(
  z.object({
    characterName: z
      .string()
      .min(1, 'Character name must be at least 1 character')
      .max(50, 'Character name must be less than 50 characters'),
    stats: z.object({
      [DEMO_STATS.STR]: z.number(),
      [DEMO_STATS.DEX]: z.number(),
      [DEMO_STATS.WIS]: z.number(),
      [DEMO_STATS.CON]: z.number(),
      [DEMO_STATS.CHA]: z.number(),
      [DEMO_STATS.INT]: z.number(),
    }),
  }),
);
