import {
  AttackAbility,
  AttackDelivery,
  CharacterStat,
  type CharacterSheet,
  type InventoryItem,
} from '@shared/api/characters';

import {
  abilityModifier,
  proficiencyBonus,
  totalAbilityScores,
} from '@entities/characters';

import { STAT_LABELS } from '@widgets/character-sheet/config/combat/constants';
import type {
  AttackMathInput,
  AttackTotals,
} from '@widgets/character-sheet/config/combat/types';

/**
 * Weapon math, composed from the entity's derived-stat helpers. It lives here
 * rather than in `entities/characters` only because this tab owns it today —
 * quick access will want it too, at which point it belongs in derived-stats.
 */

const AMMO_DELIVERIES: AttackDelivery[] = [
  AttackDelivery.THROWN,
  AttackDelivery.RANGED_FIREARM,
];

/** Bows are excluded on purpose: arrows are too cheap to bookkeep per shot. */
export const tracksAmmo = (delivery: AttackDelivery): boolean => {
  return AMMO_DELIVERIES.includes(delivery);
};

/**
 * Finesse resolves to whichever of str/dex is higher, and that one score then
 * drives both the attack roll and the damage roll — they can never be mixed.
 */
export const resolveAttackStat = (
  sheet: CharacterSheet,
  ability: AttackAbility,
  items: InventoryItem[] = [],
): CharacterStat => {
  if (ability === AttackAbility.STRENGTH) return CharacterStat.STR;
  if (ability === AttackAbility.DEXTERITY) return CharacterStat.DEX;

  const scores = totalAbilityScores(sheet, items);

  return abilityModifier(scores[CharacterStat.DEX]) >
    abilityModifier(scores[CharacterStat.STR])
    ? CharacterStat.DEX
    : CharacterStat.STR;
};

/**
 * `additionalBonus` feeds both totals; proficiency feeds only the attack roll.
 * Extra damage *dice* have no field by design — they go in the name or a tag.
 */
export const attackTotals = (
  sheet: CharacterSheet,
  input: AttackMathInput,
  items: InventoryItem[] = [],
): AttackTotals => {
  const stat = resolveAttackStat(sheet, input.ability, items);
  const modifier = abilityModifier(totalAbilityScores(sheet, items)[stat]);
  const proficiency = input.proficient ? proficiencyBonus(sheet) : 0;

  return {
    stat,
    abilityModifier: modifier,
    proficiencyBonus: proficiency,
    additionalBonus: input.additionalBonus,
    attackBonus: modifier + proficiency + input.additionalBonus,
    damageBonus: modifier + input.additionalBonus,
  };
};

export const formatSigned = (value: number): string => {
  return value < 0 ? String(value) : `+${value}`;
};

/** `Str +3 · proficiency +2 · bonus +1` — only the terms that are non-zero. */
export const attackBreakdown = (totals: AttackTotals): string => {
  const terms = [`${STAT_LABELS[totals.stat]} ${formatSigned(totals.abilityModifier)}`];

  if (totals.proficiencyBonus !== 0) {
    terms.push(`proficiency ${formatSigned(totals.proficiencyBonus)}`);
  }

  if (totals.additionalBonus !== 0) {
    terms.push(`bonus ${formatSigned(totals.additionalBonus)}`);
  }

  return terms.join(' · ');
};

/** `1d8 +5`, or just `+5` when the player left the dice field empty. */
export const formatDamage = (dice: string | null, damageBonus: number): string => {
  const bonus = formatSigned(damageBonus);

  return dice ? `${dice} ${bonus}` : bonus;
};

/** Empty, `-` mid-typing and anything unparseable all read as zero. */
export const parseBonus = (raw: string): number => {
  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : 0;
};
