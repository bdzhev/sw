import type { useForm } from 'vee-validate';

import { DEMO_STATS } from '../../config/stats';

export type DemoStats = (typeof DEMO_STATS)[keyof typeof DEMO_STATS];

export interface DemoStatsFormValues {
  characterName: string;
  stats: {
    [DEMO_STATS.STR]: number;
    [DEMO_STATS.DEX]: number;
    [DEMO_STATS.WIS]: number;
    [DEMO_STATS.CON]: number;
    [DEMO_STATS.CHA]: number;
    [DEMO_STATS.INT]: number;
  };
}

export type DemoStatsFormContext = ReturnType<typeof useForm>;
