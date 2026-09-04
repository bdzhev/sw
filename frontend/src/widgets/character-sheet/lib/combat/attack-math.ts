import { AttackAbility, AttackDelivery, CharacterStat } from '@shared/api/characters';

import { abilityModifier, type AbilityScores } from '@entities/characters';

import { STAT_LABELS } from '@widgets/character-sheet/config/combat';
import type {
  AttackMathInput,
  AttackTotals,
} from '@widgets/character-sheet/config/combat';

import { formatSigned } from '../format/numbers';

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
  totals: AbilityScores,
  ability: AttackAbility,
): CharacterStat => {
  if (ability === AttackAbility.STRENGTH) {
    return CharacterStat.STR;
  }

  if (ability === AttackAbility.DEXTERITY) {
    return CharacterStat.DEX;
  }

  return abilityModifier(totals[CharacterStat.DEX]) >
    abilityModifier(totals[CharacterStat.STR])
    ? CharacterStat.DEX
    : CharacterStat.STR;
};

/**
 * `additionalBonus` feeds both totals; proficiency feeds only the attack roll.
 * Extra damage *dice* have no field by design — they go in the name or a tag.
 *
 * Takes the bonus rather than the sheet row: `sheet.level` was the only field it
 * ever reached for, and asking for the row made every caller recompute on any
 * sheet edit — once per attack row, in the case of the combat list.
 */
export const attackTotals = (
  totals: AbilityScores,
  bonus: number,
  input: AttackMathInput,
): AttackTotals => {
  const stat = resolveAttackStat(totals, input.ability);
  const modifier = abilityModifier(totals[stat]);
  const proficiency = input.proficient ? bonus : 0;

  return {
    stat,
    abilityModifier: modifier,
    proficiencyBonus: proficiency,
    additionalBonus: input.additionalBonus,
    attackBonus: modifier + proficiency + input.additionalBonus,
    damageBonus: modifier + input.additionalBonus,
  };
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
