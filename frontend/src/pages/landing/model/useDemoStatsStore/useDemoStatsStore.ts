import { defineStore } from 'pinia';
import { reactive } from 'vue';

import { DEMO_STATS, type DemoStats } from '@widgets/demo-stats-form';

const DEFAULT_STAT_VALUE = 1;

export const useDemoStatsStore = defineStore('demoStats', () => {
  const state = reactive({
    characterName: '',
    stats: {
      [DEMO_STATS.STR]: DEFAULT_STAT_VALUE,
      [DEMO_STATS.DEX]: DEFAULT_STAT_VALUE,
      [DEMO_STATS.CON]: DEFAULT_STAT_VALUE,
      [DEMO_STATS.WIS]: DEFAULT_STAT_VALUE,
      [DEMO_STATS.INT]: DEFAULT_STAT_VALUE,
      [DEMO_STATS.CHA]: DEFAULT_STAT_VALUE,
    },
  });

  const forEachStat = (getNewValue: (key: DemoStats) => number) => {
    Object.values(DEMO_STATS).forEach((key) => {
      state.stats[key] = getNewValue(key);
    });
  };

  const resetAll = () => {
    forEachStat(() => {
      return DEFAULT_STAT_VALUE;
    });

    state.characterName = '';
  };

  const updateStat = (key: DemoStats, value: number) => {
    if (value < 0) {
      return;
    }

    state.stats[key] = value;
  };

  const updateAllStats = (newStats: Record<DemoStats, number>) => {
    forEachStat((key) => {
      return newStats[key];
    });
  };

  const updateCharName = (newName: string) => {
    state.characterName = newName;
  };

  const getStat = (key: DemoStats) => {
    return state.stats[key];
  };

  return {
    state,

    resetAll,
    updateStat,
    updateAllStats,
    updateCharName,
    getStat,
  };
});
