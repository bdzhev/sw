import {
  CharacterStat,
  SpellcastingProgression,
  type CharacterSheet,
  type InventoryItem,
} from '@shared/api/characters';

import {
  FULL_CASTER_SLOTS,
  HALF_CASTER_SLOTS,
  PACT_MAGIC_SLOTS,
  proficiencyBonusForLevel,
  THIRD_CASTER_SLOTS,
} from '../class-tables';
import { PERCEPTION_SKILL_KEY, SKILLS } from '../skills';

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
    if (!item.isEquipped) return totals;

    for (const [stat, bonus] of Object.entries(item.statModifiers)) {
      const key = stat as CharacterStat;
      totals[key] = (totals[key] ?? 0) + (bonus ?? 0);
    }

    return totals;
  }, {});
};

/** Base scores plus equipped-item bonuses — what the sheet actually displays. */
export const totalAbilityScores = (
  sheet: CharacterSheet,
  items: InventoryItem[] = [],
): AbilityScores => {
  const base = abilityScores(sheet);
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
  sheet: CharacterSheet,
  stat: CharacterStat,
  items: InventoryItem[] = [],
): number => {
  const modifier = abilityModifier(totalAbilityScores(sheet, items)[stat]);
  const isProficient = sheet.saveProficiencies.includes(stat);

  return modifier + (isProficient ? proficiencyBonus(sheet) : 0);
};

/**
 * `skillProficiencies[key]` is the proficiency multiplier: absent, 1
 * (proficient) or 2 (expertise).
 */
export const skillTotal = (
  sheet: CharacterSheet,
  skillKey: string,
  items: InventoryItem[] = [],
): number => {
  const skill = SKILLS.find((entry) => {
    return entry.key === skillKey;
  });

  if (!skill) return 0;

  const modifier = abilityModifier(totalAbilityScores(sheet, items)[skill.ability]);
  const multiplier = sheet.skillProficiencies[skillKey] ?? 0;

  return modifier + proficiencyBonus(sheet) * multiplier;
};

export const passivePerception = (
  sheet: CharacterSheet,
  items: InventoryItem[] = [],
): number => {
  return PASSIVE_BASE + skillTotal(sheet, PERCEPTION_SKILL_KEY, items);
};

/** Dex modifier plus the stored misc bonus (Alert feat and friends). */
export const initiativeTotal = (
  sheet: CharacterSheet,
  items: InventoryItem[] = [],
): number => {
  return (
    abilityModifier(totalAbilityScores(sheet, items)[CharacterStat.DEX]) +
    sheet.initiativeBonus
  );
};

export const hitDiceTotal = (sheet: CharacterSheet): number => {
  return sheet.level;
};

export const spellSaveDc = (
  sheet: CharacterSheet,
  ability: CharacterStat | null,
  items: InventoryItem[] = [],
): number | null => {
  if (!ability) return null;

  return (
    SPELL_SAVE_DC_BASE +
    proficiencyBonus(sheet) +
    abilityModifier(totalAbilityScores(sheet, items)[ability])
  );
};

export const spellAttackBonus = (
  sheet: CharacterSheet,
  ability: CharacterStat | null,
  items: InventoryItem[] = [],
): number | null => {
  if (!ability) return null;

  return (
    proficiencyBonus(sheet) + abilityModifier(totalAbilityScores(sheet, items)[ability])
  );
};

export type SlotMaxima = Partial<Record<string, number>>;

const slotsFromTable = (table: readonly number[][], level: number): SlotMaxima => {
  const row = table[level - 1] ?? [];

  return row.reduce<SlotMaxima>((maxima, count, index) => {
    if (count > 0) {
      maxima[String(index + 1)] = count;
    }

    return maxima;
  }, {});
};

/**
 * Slot maxima for the sheet's progression, keyed by slot level as a string so
 * they line up with the stored `spellSlots.current`.
 *
 * `custom` is the one progression whose maxima are player-entered, so it reads
 * them back off the row instead of a table. Pact magic lands in the same
 * keyspace with exactly one populated key.
 */
export const spellSlotMaxima = (sheet: CharacterSheet): SlotMaxima => {
  switch (sheet.spellcastingProgression) {
    case SpellcastingProgression.FULL:
      return slotsFromTable(FULL_CASTER_SLOTS, sheet.level);
    case SpellcastingProgression.HALF:
      return slotsFromTable(HALF_CASTER_SLOTS, sheet.level);
    case SpellcastingProgression.THIRD:
      return slotsFromTable(THIRD_CASTER_SLOTS, sheet.level);
    case SpellcastingProgression.PACT: {
      const pact = PACT_MAGIC_SLOTS[sheet.level - 1];

      return pact ? { [String(pact.slotLevel)]: pact.slots } : {};
    }
    case SpellcastingProgression.CUSTOM:
      return sheet.spellSlots.max ?? {};
    default:
      return {};
  }
};

/** Slot levels with a non-zero maximum — what the slot grid renders. */
export const availableSlotLevels = (sheet: CharacterSheet): number[] => {
  const maxima = spellSlotMaxima(sheet);

  return Array.from({ length: MAX_SLOT_LEVEL }, (_, index) => {
    return index + 1;
  }).filter((slotLevel) => {
    return (maxima[String(slotLevel)] ?? 0) > 0;
  });
};
