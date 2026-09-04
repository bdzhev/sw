import { describe, expect, it } from 'vitest';

import {
  AttackAbility,
  AttackDelivery,
  CharacterStat,
  type CharacterSheet,
} from '@shared/api/characters';

import type { AbilityScores } from '@entities/characters';

import {
  attackBreakdown,
  attackTotals,
  formatDamage,
  parseBonus,
  resolveAttackStat,
  tracksAmmo,
} from '../attack-math';

/** Only `level` is read, via `proficiencyBonus`. */
const sheetAtLevel = (level: number): CharacterSheet => {
  return { level } as CharacterSheet;
};

const scores = (str: number, dex: number): AbilityScores => {
  return {
    [CharacterStat.STR]: str,
    [CharacterStat.DEX]: dex,
    [CharacterStat.CON]: 10,
    [CharacterStat.INT]: 10,
    [CharacterStat.WIS]: 10,
    [CharacterStat.CHA]: 10,
  };
};

describe('tracksAmmo', () => {
  it('tracks thrown and firearms, never bows', () => {
    expect(tracksAmmo(AttackDelivery.THROWN)).toBe(true);
    expect(tracksAmmo(AttackDelivery.RANGED_FIREARM)).toBe(true);
    expect(tracksAmmo(AttackDelivery.RANGED_BOW)).toBe(false);
    expect(tracksAmmo(AttackDelivery.MELEE)).toBe(false);
  });
});

describe('resolveAttackStat', () => {
  it('takes the named ability when one is named', () => {
    expect(resolveAttackStat(scores(8, 20), AttackAbility.STRENGTH)).toBe(
      CharacterStat.STR,
    );
    expect(resolveAttackStat(scores(20, 8), AttackAbility.DEXTERITY)).toBe(
      CharacterStat.DEX,
    );
  });

  it('resolves finesse to the higher modifier', () => {
    expect(resolveAttackStat(scores(18, 12), AttackAbility.FINESSE)).toBe(
      CharacterStat.STR,
    );
    expect(resolveAttackStat(scores(12, 18), AttackAbility.FINESSE)).toBe(
      CharacterStat.DEX,
    );
  });

  /**
   * The tie-break is on the *modifier*, not the score, so 14 and 15 tie — both
   * are +2 — and strength wins. A score comparison would pick dex.
   */
  it('breaks a modifier tie towards strength', () => {
    expect(resolveAttackStat(scores(14, 15), AttackAbility.FINESSE)).toBe(
      CharacterStat.STR,
    );
  });
});

describe('attackTotals', () => {
  it('adds proficiency to the attack roll but never to damage', () => {
    const totals = attackTotals(scores(18, 10), sheetAtLevel(5), {
      ability: AttackAbility.STRENGTH,
      proficient: true,
      additionalBonus: 0,
    });

    expect(totals.abilityModifier).toBe(4);
    expect(totals.proficiencyBonus).toBe(3);
    expect(totals.attackBonus).toBe(7);
    expect(totals.damageBonus).toBe(4);
  });

  it('zeroes the proficiency term when the attack is not proficient', () => {
    const totals = attackTotals(scores(18, 10), sheetAtLevel(5), {
      ability: AttackAbility.STRENGTH,
      proficient: false,
      additionalBonus: 0,
    });

    expect(totals.proficiencyBonus).toBe(0);
    expect(totals.attackBonus).toBe(4);
  });

  it('feeds additionalBonus into both totals', () => {
    const totals = attackTotals(scores(18, 10), sheetAtLevel(1), {
      ability: AttackAbility.STRENGTH,
      proficient: false,
      additionalBonus: 1,
    });

    expect(totals.attackBonus).toBe(5);
    expect(totals.damageBonus).toBe(5);
  });

  it('reports which stat finesse picked', () => {
    const totals = attackTotals(scores(10, 18), sheetAtLevel(1), {
      ability: AttackAbility.FINESSE,
      proficient: false,
      additionalBonus: 0,
    });

    expect(totals.stat).toBe(CharacterStat.DEX);
  });
});

describe('attackBreakdown', () => {
  it('omits the zero terms', () => {
    const totals = attackTotals(scores(18, 10), sheetAtLevel(1), {
      ability: AttackAbility.STRENGTH,
      proficient: false,
      additionalBonus: 0,
    });

    expect(attackBreakdown(totals)).toBe('Str +4');
  });

  it('lists every non-zero term in order', () => {
    const totals = attackTotals(scores(18, 10), sheetAtLevel(5), {
      ability: AttackAbility.STRENGTH,
      proficient: true,
      additionalBonus: 1,
    });

    expect(attackBreakdown(totals)).toBe('Str +4 · proficiency +3 · bonus +1');
  });

  /** A negative ability modifier still reads as one term, not a doubled sign. */
  it('keeps a negative modifier readable', () => {
    const totals = attackTotals(scores(6, 10), sheetAtLevel(1), {
      ability: AttackAbility.STRENGTH,
      proficient: false,
      additionalBonus: 0,
    });

    expect(attackBreakdown(totals)).toBe('Str -2');
  });
});

describe('formatDamage', () => {
  it('joins dice and bonus', () => {
    expect(formatDamage('1d8', 5)).toBe('1d8 +5');
  });

  it('falls back to the bonus alone when the dice field is empty', () => {
    expect(formatDamage(null, 5)).toBe('+5');
  });

  it('still signs a zero bonus', () => {
    expect(formatDamage('1d4', 0)).toBe('1d4 +0');
  });
});

describe('parseBonus', () => {
  it('reads a number', () => {
    expect(parseBonus('3')).toBe(3);
    expect(parseBonus('-2')).toBe(-2);
  });

  /** Empty and a lone minus both occur mid-typing and must not throw or NaN. */
  it('reads anything unparseable as zero', () => {
    expect(parseBonus('')).toBe(0);
    expect(parseBonus('-')).toBe(0);
    expect(parseBonus('abc')).toBe(0);
  });
});
