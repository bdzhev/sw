import {
  CharacterClass,
  CharacterRace,
  CharacterStat,
  SpellcastingProgression,
} from '@shared/api/characters';

/**
 * The rules tables, in one place, because four tabs and all three atomic server
 * actions read them. Pure data, no I/O.
 *
 * A wrong number here is wrong in several features at once, so every table below
 * is transcribed from a source that spells the numbers out (the vault's
 * `design/tabs/*` docs). Tables the docs only *assert* — class resource maxima
 * by level, cantrips/spells-known counts — are deliberately absent rather than
 * guessed; see the note at the bottom.
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

export const HIT_DIE_BY_CLASS: Record<CharacterClass, number> = {
  [CharacterClass.BARBARIAN]: 12,
  [CharacterClass.FIGHTER]: 10,
  [CharacterClass.PALADIN]: 10,
  [CharacterClass.RANGER]: 10,
  [CharacterClass.BARD]: 8,
  [CharacterClass.CLERIC]: 8,
  [CharacterClass.DRUID]: 8,
  [CharacterClass.MONK]: 8,
  [CharacterClass.ROGUE]: 8,
  [CharacterClass.WARLOCK]: 8,
  [CharacterClass.SORCERER]: 6,
  [CharacterClass.WIZARD]: 6,
};

/** null = the class has no spellcasting ability at base. */
export const SPELLCASTING_ABILITY_BY_CLASS: Record<CharacterClass, CharacterStat | null> =
  {
    [CharacterClass.WIZARD]: CharacterStat.INT,
    [CharacterClass.CLERIC]: CharacterStat.WIS,
    [CharacterClass.DRUID]: CharacterStat.WIS,
    [CharacterClass.RANGER]: CharacterStat.WIS,
    [CharacterClass.BARD]: CharacterStat.CHA,
    [CharacterClass.PALADIN]: CharacterStat.CHA,
    [CharacterClass.SORCERER]: CharacterStat.CHA,
    [CharacterClass.WARLOCK]: CharacterStat.CHA,
    [CharacterClass.BARBARIAN]: null,
    [CharacterClass.FIGHTER]: null,
    [CharacterClass.MONK]: null,
    [CharacterClass.ROGUE]: null,
  };

/**
 * The two saving throws each class is proficient in. This is the one
 * proficiency the app auto-fills, because it involves no choice at all —
 * skills and languages stay player-entered on purpose.
 */
export const SAVE_PROFICIENCIES_BY_CLASS: Record<
  CharacterClass,
  [CharacterStat, CharacterStat]
> = {
  [CharacterClass.BARBARIAN]: [CharacterStat.STR, CharacterStat.CON],
  [CharacterClass.BARD]: [CharacterStat.DEX, CharacterStat.CHA],
  [CharacterClass.CLERIC]: [CharacterStat.WIS, CharacterStat.CHA],
  [CharacterClass.DRUID]: [CharacterStat.INT, CharacterStat.WIS],
  [CharacterClass.FIGHTER]: [CharacterStat.STR, CharacterStat.CON],
  [CharacterClass.MONK]: [CharacterStat.STR, CharacterStat.DEX],
  [CharacterClass.PALADIN]: [CharacterStat.WIS, CharacterStat.CHA],
  [CharacterClass.RANGER]: [CharacterStat.STR, CharacterStat.DEX],
  [CharacterClass.ROGUE]: [CharacterStat.DEX, CharacterStat.INT],
  [CharacterClass.SORCERER]: [CharacterStat.CON, CharacterStat.CHA],
  [CharacterClass.WARLOCK]: [CharacterStat.WIS, CharacterStat.CHA],
  [CharacterClass.WIZARD]: [CharacterStat.INT, CharacterStat.WIS],
};

/** Twin of `speedForRace` in the backend's character.defaults.ts. */
export const SPEED_BY_RACE: Record<CharacterRace, number> = {
  [CharacterRace.DWARF]: 25,
  [CharacterRace.HALFLING]: 25,
  [CharacterRace.GNOME]: 25,
  [CharacterRace.HUMAN]: 30,
  [CharacterRace.ELF]: 30,
  [CharacterRace.HALF_ORC]: 30,
  [CharacterRace.TIEFLING]: 30,
  [CharacterRace.DRAGONBORN]: 30,
  [CharacterRace.HALF_ELF]: 30,
};

/**
 * Pre-fills the progression field; it is never a lock. Any character can be
 * switched to any progression (eldritch knight, a homebrew feat, a DM call).
 */
export const DEFAULT_PROGRESSION_BY_CLASS: Record<
  CharacterClass,
  SpellcastingProgression
> = {
  [CharacterClass.BARD]: SpellcastingProgression.FULL,
  [CharacterClass.CLERIC]: SpellcastingProgression.FULL,
  [CharacterClass.DRUID]: SpellcastingProgression.FULL,
  [CharacterClass.SORCERER]: SpellcastingProgression.FULL,
  [CharacterClass.WIZARD]: SpellcastingProgression.FULL,
  [CharacterClass.PALADIN]: SpellcastingProgression.HALF,
  [CharacterClass.RANGER]: SpellcastingProgression.HALF,
  [CharacterClass.WARLOCK]: SpellcastingProgression.PACT,
  [CharacterClass.BARBARIAN]: SpellcastingProgression.NONE,
  [CharacterClass.FIGHTER]: SpellcastingProgression.NONE,
  [CharacterClass.MONK]: SpellcastingProgression.NONE,
  [CharacterClass.ROGUE]: SpellcastingProgression.NONE,
};

/**
 * Slots by character level, indexed `[level - 1]`, each row listing slot levels
 * 1st upward. A short row means no slots of the missing levels yet.
 */
export const FULL_CASTER_SLOTS: readonly number[][] = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/** Paladin / ranger — delayed, capped at 5th-level slots. */
export const HALF_CASTER_SLOTS: readonly number[][] = [
  [],
  [2],
  [3],
  [3],
  [4, 2],
  [4, 2],
  [4, 3],
  [4, 3],
  [4, 3, 2],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2],
];

/** No SRD base class defaults to this; it exists as an override pick. */
export const THIRD_CASTER_SLOTS: readonly number[][] = [
  [],
  [],
  [2],
  [3],
  [3],
  [3],
  [4, 2],
  [4, 2],
  [4, 2],
  [4, 3],
  [4, 3],
  [4, 3],
  [4, 3, 2],
  [4, 3, 2],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 1],
];

export interface PactMagicSlots {
  slots: number;
  slotLevel: number;
}

/** Warlock — one slot level, small pool, recovers on a **short** rest. */
export const PACT_MAGIC_SLOTS: readonly PactMagicSlots[] = [
  { slots: 1, slotLevel: 1 },
  { slots: 2, slotLevel: 1 },
  { slots: 2, slotLevel: 2 },
  { slots: 2, slotLevel: 2 },
  { slots: 2, slotLevel: 3 },
  { slots: 2, slotLevel: 3 },
  { slots: 2, slotLevel: 4 },
  { slots: 2, slotLevel: 4 },
  { slots: 2, slotLevel: 5 },
  { slots: 2, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 3, slotLevel: 5 },
  { slots: 4, slotLevel: 5 },
  { slots: 4, slotLevel: 5 },
  { slots: 4, slotLevel: 5 },
  { slots: 4, slotLevel: 5 },
];

/*
 * Not here yet, on purpose:
 *
 * - **class resource maxima by level** (rage 2→6, ki = level, lay on hands =
 *   5 × level, …). The design docs assert this table exists without containing
 *   it, so it needs sourcing from the SRD rather than memory — its consumer is
 *   the traits-and-features tab.
 * - **cantrips / spells-known counts** — only the level-up suggestions need
 *   them, and that is a later wave.
 * - **racial languages** — deliberately never added: languages are
 *   player-entered and not prompted by setup, so there is nothing to derive.
 */
