import { CharacterStat } from '@shared/api/characters';
import type { ToggleChipOption } from '@shared/ui/toggle-chip-group';

import { STANDARD_LANGUAGES } from '@entities/characters';

/**
 * The five abilities that govern skills, in the order the design doc groups them.
 * Constitution governs none, so it is deliberately absent — this is why the list
 * is not just `ABILITIES` from the entity.
 *
 * The ability labels themselves come from `@entities/characters`.
 */
export const SKILL_ABILITY_ORDER: readonly CharacterStat[] = [
  CharacterStat.STR,
  CharacterStat.DEX,
  CharacterStat.INT,
  CharacterStat.WIS,
  CharacterStat.CHA,
];

/** The SRD list as chips; the language is its own label. */
export const STANDARD_LANGUAGE_OPTIONS: ToggleChipOption[] = STANDARD_LANGUAGES.map(
  (language) => {
    return { value: language, label: language };
  },
);
