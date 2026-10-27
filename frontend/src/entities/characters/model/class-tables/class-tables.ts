import {
  CharacterClass,
  CharacterStat,
  SpellcastingProgression,
} from '@shared/api/characters';

import {
  FULL_CASTER_SLOTS,
  HALF_CASTER_SLOTS,
  PACT_MAGIC_SLOTS,
  SPELLCASTING_ABILITY_BY_CLASS,
  THIRD_CASTER_SLOTS,
} from '@entities/characters/config/class-tables';
import type { SlotTableMaxima } from '@entities/characters/config/class-tables';

/**
 * The lookups into the rules tables. Data lives in `config/class-tables`; this
 * is the reading of it.
 */

const PROFICIENCY_BASE = 2;
const LEVELS_PER_PROFICIENCY_STEP = 4;

/**
 * +2 at 1-4, +3 at 5-8, +4 at 9-12, +5 at 13-16, +6 at 17-20. Exact for the
 * whole 1-20 range, so the formula is the table.
 */
export const proficiencyBonusForLevel = (level: number): number => {
  return Math.floor((level - 1) / LEVELS_PER_PROFICIENCY_STEP) + PROFICIENCY_BASE;
};

const slotsFromTable = (table: readonly number[][], level: number): SlotTableMaxima => {
  const row = table[level - 1] ?? [];

  return row.reduce<SlotTableMaxima>((maxima, count, index) => {
    if (count > 0) {
      maxima[String(index + 1)] = count;
    }

    return maxima;
  }, {});
};

/**
 * What the rules say this character's slots would be. Nothing derives the grid
 * from this any more — the player types their own maxima — but the tab offers
 * it as a one-tap fill, which is the whole reason the tables in
 * `config/class-tables` still earn their place. `null` means the progression has no table to read.
 */
export const slotMaximaFromProgression = (
  progression: SpellcastingProgression,
  level: number,
): SlotTableMaxima | null => {
  switch (progression) {
    case SpellcastingProgression.FULL:
      return slotsFromTable(FULL_CASTER_SLOTS, level);
    case SpellcastingProgression.HALF:
      return slotsFromTable(HALF_CASTER_SLOTS, level);
    case SpellcastingProgression.THIRD:
      return slotsFromTable(THIRD_CASTER_SLOTS, level);
    case SpellcastingProgression.PACT: {
      const pact = PACT_MAGIC_SLOTS[level - 1];

      return pact ? { [String(pact.slotLevel)]: pact.slots } : {};
    }
    default:
      return null;
  }
};

/**
 * The caster ability the sheet actually uses.
 *
 * Fighter and rogue map to `null` above, but an eldritch knight or arcane
 * trickster overrides progression to `third` — the exact case the override
 * exists for — and would otherwise get a working slot grid with a dash for save
 * DC and attack bonus. INT is the SRD ability for both subclasses.
 */
export const resolveSpellcastingAbility = (
  characterClass: CharacterClass,
  progression: SpellcastingProgression,
): CharacterStat | null => {
  const fromClass = SPELLCASTING_ABILITY_BY_CLASS[characterClass];

  if (fromClass) {
    return fromClass;
  }

  return progression === SpellcastingProgression.NONE ? null : CharacterStat.INT;
};
