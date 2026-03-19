export const DEMO_STATS = {
  STR: 'str',
  DEX: 'dex',
  CON: 'con',
  WIS: 'wis',
  INT: 'int',
  CHA: 'cha',
} as const;

/**
 * You should make these as fns to fill in the needed part of text
 * with the name of the character.
 */
const demoStatInputDemoItemData = {
  [DEMO_STATS.STR]: { title: 'Can you lift 200 pounds?', description: 'test' },
  [DEMO_STATS.DEX]: { title: 'Can you run very fast?', description: 'test' },
  [DEMO_STATS.CON]: { title: 'Do you ever get sick?', description: 'test' },
  [DEMO_STATS.WIS]: { title: 'Are your senses sharp?', description: 'test' },
  [DEMO_STATS.INT]: { title: 'Are you smart?', description: 'test' },
  [DEMO_STATS.CHA]: { title: 'Are you good with words?', description: 'test' },
};

export const demoStatInputDemoItems = Object.values(DEMO_STATS).map((stat) => {
  return {
    id: stat,
    title: demoStatInputDemoItemData[stat].title,
    description: demoStatInputDemoItemData[stat].description,
  };
});
