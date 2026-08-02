import { CharacterStat } from '@shared/api/characters';

/** The sheet row stores INT as `intScore`; the other five match the enum value. */
export type AbilitySheetField = 'str' | 'dex' | 'con' | 'intScore' | 'wis' | 'cha';

export interface AbilityDescriptor {
  stat: CharacterStat;
  /** Which `CharacterSheet` column holds the raw score. */
  field: AbilitySheetField;
  abbr: string;
  name: string;
}

/**
 * The six abilities in paper-sheet order (STR → CHA), which is not the enum's
 * declaration order.
 *
 * This lives in the entity rather than in a tab because the main tab, the skills
 * tab and anything else that labels an ability need the same strings — it was
 * briefly written twice, once per tab, which is how labels drift apart.
 */
export const ABILITIES: readonly AbilityDescriptor[] = [
  { stat: CharacterStat.STR, field: 'str', abbr: 'STR', name: 'Strength' },
  { stat: CharacterStat.DEX, field: 'dex', abbr: 'DEX', name: 'Dexterity' },
  { stat: CharacterStat.CON, field: 'con', abbr: 'CON', name: 'Constitution' },
  {
    stat: CharacterStat.INT,
    field: 'intScore',
    abbr: 'INT',
    name: 'Intelligence',
  },
  { stat: CharacterStat.WIS, field: 'wis', abbr: 'WIS', name: 'Wisdom' },
  { stat: CharacterStat.CHA, field: 'cha', abbr: 'CHA', name: 'Charisma' },
];

const byStat = <T>(pick: (ability: AbilityDescriptor) => T): Record<CharacterStat, T> => {
  return ABILITIES.reduce(
    (map, ability) => {
      map[ability.stat] = pick(ability);

      return map;
    },
    {} as Record<CharacterStat, T>,
  );
};

/** Derived from ABILITIES, so a label can only ever be defined once. */
export const ABILITY_LABELS: Record<CharacterStat, string> = byStat((ability) => {
  return ability.name;
});

export const ABILITY_SHORT_LABELS: Record<CharacterStat, string> = byStat((ability) => {
  return ability.abbr;
});

export const ABILITY_SHEET_FIELDS: Record<CharacterStat, AbilitySheetField> = byStat(
  (ability) => {
    return ability.field;
  },
);
