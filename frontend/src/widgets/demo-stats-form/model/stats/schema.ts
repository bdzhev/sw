import { toTypedSchema } from '@vee-validate/zod';
import z4 from 'zod/v4';

import { DEMO_STATS } from '../../config/stats';

export const demoStatsSchema = toTypedSchema(
  z4.object({
    characterName: z4
      .string()
      .min(1, 'Character name must be at least 1 character')
      .max(50, 'Character name must be less than 50 characters'),
    stats: z4.object({
      [DEMO_STATS.STR]: z4.number(),
      [DEMO_STATS.DEX]: z4.number(),
      [DEMO_STATS.WIS]: z4.number(),
      [DEMO_STATS.CON]: z4.number(),
      [DEMO_STATS.CHA]: z4.number(),
      [DEMO_STATS.INT]: z4.number(),
    }),
  }),
);
