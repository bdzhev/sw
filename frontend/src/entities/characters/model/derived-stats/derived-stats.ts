import {
  CharacterStat,
  type CharacterSheet,
  type InventoryItem,
} from '@shared/api/characters';

import { proficiencyBonusForLevel } from '@entities/characters/lib/class-tables';
import { PERCEPTION_SKILL_KEY, SKILLS } from '@entities/characters/lib/skills';

/**
 * Every derived number the sheet shows, in one module, so no tab reimplements
 * the arithmetic. Nothing here is ever persisted — storing these would be a
 * second source of truth to keep in sync.
 *
 * The two stored exceptions are `hpMax` (rolled by the player) and the misc
 * half of `initiativeBonus`, and both are inputs here rather than outputs.
 */

const ABILITY_BASE = 10;
const ABILITY_STEP = 2;
const PASSIVE_BASE = 10;
const SPELL_SAVE_DC_BASE = 8;
const MAX_SLOT_LEVEL = 9;

export type AbilityScores = Record<CharacterStat, number>;

/** The sheet row names INT `intScore`; everything downstream wants the enum. */
export const abilityScores = (sheet: CharacterSheet): AbilityScores => {
  return {
    [CharacterStat.STR]: sheet.str,
    [CharacterStat.DEX]: sheet.dex,
    [CharacterStat.CON]: sheet.con,
    [CharacterStat.INT]: sheet.intScore,
    [CharacterStat.WIS]: sheet.wis,
    [CharacterStat.CHA]: sheet.cha,
  };
};

export const abilityModifier = (score: number): number => {
  return Math.floor((score - ABILITY_BASE) / ABILITY_STEP);
};

/**
 * Modifiers from equipped items only. Derived from the item rows the sheet
 * already holds rather than stored, so deleting an item cannot leave a phantom
 * bonus and no item write ever touches the autosave row.
 */
export const bonusesFromItems = (items: InventoryItem[]): Partial<AbilityScores> => {
  return items.reduce<Partial<AbilityScores>>((totals, item) => {
    if (!item.isEquipped) {
      return totals;
    }

    for (const [stat, bonus] of Object.entries(item.statModifiers)) {
      const key = stat as CharacterStat;
      totals[key] = (totals[key] ?? 0) + (bonus ?? 0);
    }

    return totals;
  }, {});
};

/**
 * Base scores plus equipped-item bonuses — what the sheet actually displays.
 *
 * **The one function here that walks the item list, and the one thing a consumer
 * memoizes.** Everything downstream takes the result rather than the inputs: when
 * these helpers each recomputed it internally, calling six of them cost six full
 * scans of a two-hundred-item inventory and nothing at the call site said so.
 */
export const totalAbilityScores = (
  sheet: CharacterSheet,
  items: InventoryItem[] = [],
): AbilityScores => {
  return withItemBonuses(abilityScores(sheet), items);
};

/**
 * The summing half of `totalAbilityScores`, for a reactive consumer that already
 * holds the base scores. Taking the sheet row instead is what makes such a
 * consumer recompute on every unrelated edit.
 */
export const withItemBonuses = (
  base: AbilityScores,
  items: InventoryItem[] = [],
): AbilityScores => {
  const bonuses = bonusesFromItems(items);

  return Object.entries(base).reduce((totals, [stat, score]) => {
    const key = stat as CharacterStat;
    totals[key] = score + (bonuses[key] ?? 0);

    return totals;
  }, {} as AbilityScores);
};

export const proficiencyBonus = (sheet: CharacterSheet): number => {
  return proficiencyBonusForLevel(sheet.level);
};

export const savingThrowTotal = (
  totals: AbilityScores,
  sheet: CharacterSheet,
  stat: CharacterStat,
): number => {
  const modifier = abilityModifier(totals[stat]);
  const isProficient = sheet.saveProficiencies.includes(stat);

  return modifier + (isProficient ? proficiencyBonus(sheet) : 0);
};

/**
 * `skillProficiencies[key]` is the proficiency multiplier: absent, 1
 * (proficient) or 2 (expertise).
 */
export const skillTotal = (
  totals: AbilityScores,
  sheet: CharacterSheet,
  skillKey: string,
): number => {
  const skill = SKILLS.find((entry) => {
    return entry.key === skillKey;
  });

  if (!skill) {
    return 0;
  }

  return skillModifier(
    totals,
    skill.ability,
    sheet.skillProficiencies[skillKey] ?? 0,
    proficiencyBonus(sheet),
  );
};

/**
 * `skillTotal` over the four values it actually reads, for a consumer that has
 * already narrowed its dependency on the sheet. Taking the whole row here is what
 * makes a reactive caller recompute on a languages edit.
 */
export const skillModifier = (
  totals: AbilityScores,
  ability: CharacterStat,
  proficiencyMultiplier: number,
  bonus: number,
): number => {
  return abilityModifier(totals[ability]) + bonus * proficiencyMultiplier;
};

export const passivePerception = (
  totals: AbilityScores,
  sheet: CharacterSheet,
): number => {
  return PASSIVE_BASE + skillTotal(totals, sheet, PERCEPTION_SKILL_KEY);
};

/** Dex modifier plus the stored misc bonus (Alert feat and friends). */
export const initiativeTotal = (totals: AbilityScores, sheet: CharacterSheet): number => {
  return abilityModifier(totals[CharacterStat.DEX]) + sheet.initiativeBonus;
};

export const hitDiceTotal = (sheet: CharacterSheet): number => {
  return sheet.level;
};

export const spellSaveDc = (
  totals: AbilityScores,
  sheet: CharacterSheet,
  ability: CharacterStat | null,
): number | null => {
  if (!ability) {
    return null;
  }

  return SPELL_SAVE_DC_BASE + proficiencyBonus(sheet) + abilityModifier(totals[ability]);
};

export const spellAttackBonus = (
  totals: AbilityScores,
  sheet: CharacterSheet,
  ability: CharacterStat | null,
): number | null => {
  if (!ability) {
    return null;
  }

  return proficiencyBonus(sheet) + abilityModifier(totals[ability]);
};

export type SlotMaxima = Partial<Record<string, number>>;

/**
 * Slot maxima, keyed by slot level as a string so they line up with the stored
 * `spellSlots.current`.
 *
 * Player-entered for every character now, not read off a class table. The
 * tables were right about the rules and wrong about this app's job — every
 * other tab already refuses to assert what a character should have, and
 * `custom` progression only ever helped a player who knew to go looking for it.
 * The tables stay in `class-tables` for level-up and for the fill-from-table
 * action; nothing derives the grid from them.
 */
export const spellSlotMaxima = (sheet: CharacterSheet): SlotMaxima => {
  return sheet.spellSlots.max ?? {};
};

/** Slot levels with a non-zero maximum. Not the grid — that shows all nine. */
export const availableSlotLevels = (sheet: CharacterSheet): number[] => {
  const maxima = spellSlotMaxima(sheet);

  return Array.from({ length: MAX_SLOT_LEVEL }, (_, index) => {
    return index + 1;
  }).filter((slotLevel) => {
    return (maxima[String(slotLevel)] ?? 0) > 0;
  });
};
