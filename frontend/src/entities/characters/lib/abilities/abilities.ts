import type { CharacterStat } from '@shared/api/characters';

import { ABILITIES } from '@entities/characters/config/abilities';
import type {
  AbilityDescriptor,
  AbilitySheetField,
} from '@entities/characters/config/abilities';

/**
 * Derived from `ABILITIES`, so a label can only ever be defined once.
 *
 * camelCase on purpose: these are worked out at module load, not written down.
 * Uppercase would read as a hand-maintained table, which is what `ABILITIES`
 * over in `config/abilities` actually is.
 */
const byStat = <T>(pick: (ability: AbilityDescriptor) => T): Record<CharacterStat, T> => {
  return ABILITIES.reduce(
    (map, ability) => {
      map[ability.stat] = pick(ability);

      return map;
    },
    {} as Record<CharacterStat, T>,
  );
};

export const abilityLabels: Record<CharacterStat, string> = byStat((ability) => {
  return ability.name;
});

export const abilityShortLabels: Record<CharacterStat, string> = byStat((ability) => {
  return ability.abbr;
});

export const abilitySheetFields: Record<CharacterStat, AbilitySheetField> = byStat(
  (ability) => {
    return ability.field;
  },
);
