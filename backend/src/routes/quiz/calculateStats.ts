import { characterClassEnum, characterRaceEnum } from '../../db';

type CharacterClass = (typeof characterClassEnum.enumValues)[number];
type CharacterRace = (typeof characterRaceEnum.enumValues)[number];

enum Stat {
  STR = 'str',
  DEX = 'dex',
  CON = 'con',
  INT = 'int',
  WIS = 'wis',
  CHA = 'cha',
}

type QuizCharacterStats = Exclude<Stat, Stat.CON>;
type QuizResults = Record<string, QuizCharacterStats>;
type CharacterStats = Record<Stat, number>;

const ALL_STATS: Stat[] = [Stat.STR, Stat.DEX, Stat.CON, Stat.INT, Stat.WIS, Stat.CHA];

const MAX_POINT_PER_STAT = 9;
const RESTRICTED_VALUES = [6, 8];
const MAX_TOTAL_POINTS = 27;
const MULTIPLIERS = [1.75, 1.5, 1.25];

const pointsToAbilityScores: Record<number, number> = {
  0: 8, 1: 9, 2: 10, 3: 11, 4: 12, 5: 13, 7: 14, 9: 15,
};

const classStatPriorities: Record<CharacterClass, Stat[]> = {
  barbarian: [Stat.STR, Stat.CON, Stat.DEX],
  bard:      [Stat.CHA, Stat.DEX, Stat.CON],
  cleric:    [Stat.WIS, Stat.CON, Stat.STR],
  druid:     [Stat.WIS, Stat.CON, Stat.DEX],
  fighter:   [Stat.STR, Stat.CON, Stat.DEX],
  monk:      [Stat.DEX, Stat.WIS, Stat.CON],
  paladin:   [Stat.STR, Stat.CHA, Stat.CON],
  ranger:    [Stat.DEX, Stat.WIS, Stat.CON],
  rogue:     [Stat.DEX, Stat.CON, Stat.CON],
  sorcerer:  [Stat.CHA, Stat.CON, Stat.DEX],
  warlock:   [Stat.CHA, Stat.CON, Stat.DEX],
  wizard:    [Stat.INT, Stat.CON, Stat.DEX],
};

// DB races are generic (elf, dwarf, etc.) — map to a default sub-race bonus
const racialBonusMap: Record<CharacterRace, Partial<CharacterStats>> = {
  human:       { [Stat.STR]: 1, [Stat.DEX]: 1, [Stat.CON]: 1, [Stat.INT]: 1, [Stat.WIS]: 1, [Stat.CHA]: 1 },
  elf:         { [Stat.INT]: 1 },                         // defaults to high-elf
  dwarf:       { [Stat.CON]: 2, [Stat.WIS]: 1 },          // defaults to hill-dwarf
  halfling:    { [Stat.CHA]: 1 },                         // defaults to lightfoot
  gnome:       { [Stat.INT]: 2, [Stat.DEX]: 1 },          // defaults to forest gnome
  'half-orc':  { [Stat.STR]: 2, [Stat.CON]: 1 },
  tiefling:    { [Stat.CHA]: 2, [Stat.INT]: 1 },
  dragonborn:  { [Stat.STR]: 2, [Stat.CHA]: 1 },
  'half-elf':  { [Stat.CON]: 2 },
};

const sanitize = (value: number): number =>{
  return RESTRICTED_VALUES.includes(value) ? value - 1 : value;
}

export const calculateStats = (
  results: Partial<QuizResults>,
  charClass: CharacterClass,
  race: CharacterRace,
): CharacterStats => {
  const points = ALL_STATS.reduce((acc, stat) => ({ ...acc, [stat]: 0 }), {} as CharacterStats);

  for (const stat of Object.values(results)) {
    points[stat as Stat]++;
  }

  const priorities = classStatPriorities[charClass] ?? [];
  const weighted = { ...points };
  const totalQuizAnswers = Object.values(results).length;
  const baseConWeight = totalQuizAnswers / (ALL_STATS.length - 1);

  priorities.forEach((stat, index) => {
    const multiplier = MULTIPLIERS[index] ?? 1;
    weighted[stat] = (weighted[stat] || 0) * multiplier;

    if (stat === Stat.CON && points[Stat.CON] === 0) {
      weighted[Stat.CON] = baseConWeight * multiplier;
    }
  });

  const totalWeight = Object.values(weighted).reduce((a, b) => a + b, 0);

  const allocated = ALL_STATS.reduce((acc, stat) => {
    const raw = Math.round((weighted[stat] / totalWeight) * MAX_TOTAL_POINTS);
    acc[stat] = sanitize(Math.min(raw, MAX_POINT_PER_STAT));
    return acc;
  }, {} as CharacterStats);

  let total = Object.values(allocated).reduce((a, b) => a + b, 0);

  const sortedStats = [...ALL_STATS].sort((a, b) => weighted[b] - weighted[a]);

  while (total > MAX_TOTAL_POINTS) {
    for (const stat of sortedStats) {
      if (allocated[stat] > 1) {
        allocated[stat]--;
        total--;
        break;
      }
    }
  }

  while (total < MAX_TOTAL_POINTS) {
    for (const stat of sortedStats) {
      if (allocated[stat] < MAX_POINT_PER_STAT && !RESTRICTED_VALUES.includes(allocated[stat] + 1)) {
        allocated[stat]++;
        total++;
        break;
      }
    }
  }

  const racialBonus = racialBonusMap[race] ?? {};

  return ALL_STATS.reduce((acc, stat) => {
    acc[stat] = (pointsToAbilityScores[allocated[stat]] ?? 8) + (racialBonus[stat] ?? 0);

    return acc;
  }, {} as CharacterStats);
};
