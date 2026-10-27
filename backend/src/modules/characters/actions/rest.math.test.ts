import { describe, expect, it } from 'bun:test';

import {
  hitDiceRegained,
  nextSheetAfterRest,
  restoredSlots,
} from './rest.math';
import type { SpellSlots } from './rest.math';

type Sheet = Parameters<typeof nextSheetAfterRest>[0];

const slots = (
  current: Record<string, number>,
  max?: Record<string, number>
): SpellSlots => {
  return max ? { current, max } : { current };
};

/** A level-5 warlock-shaped row; each test overrides what it is about. */
const sheetOf = (overrides: Partial<Sheet> = {}): Sheet => {
  return {
    characterId: 'c1',
    level: 5,
    hpCurrent: 4,
    hpMax: 13,
    tempHp: 3,
    hitDiceRemaining: 5,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    spellcastingProgression: 'pact',
    spellSlots: slots({ '3': 0 }, { '3': 2 }),
    ...overrides,
  } as Sheet;
};

describe('short rest', () => {
  it('adds the rolled healing, capped at hp max', () => {
    const next = nextSheetAfterRest(sheetOf(), {
      type: 'short',
      diceSpent: 2,
      healingRolled: 40,
    });

    expect(next.hpCurrent).toBe(13);
    expect(next.hitDiceRemaining).toBe(3);
  });

  it('leaves temp hp alone', () => {
    const next = nextSheetAfterRest(sheetOf(), {
      type: 'short',
      diceSpent: 0,
      healingRolled: 0,
    });

    expect(next.tempHp).toBe(3);
  });

  it('restores pact slots', () => {
    const next = nextSheetAfterRest(sheetOf(), {
      type: 'short',
      diceSpent: 0,
      healingRolled: 0,
    });

    expect(next.spellSlots.current).toEqual({ '3': 2 });
  });

  it("leaves every other progression's slots untouched", () => {
    const next = nextSheetAfterRest(
      sheetOf({
        spellcastingProgression: 'full',
        spellSlots: slots({ '1': 0 }, { '1': 4 }),
      }),
      { type: 'short', diceSpent: 0, healingRolled: 0 }
    );

    expect(next.spellSlots.current).toEqual({ '1': 0 });
  });

  it('clears death saves when it heals a dying character', () => {
    const next = nextSheetAfterRest(
      sheetOf({ hpCurrent: 0, deathSaveSuccesses: 2, deathSaveFailures: 1 }),
      { type: 'short', diceSpent: 1, healingRolled: 5 }
    );

    expect(next.deathSaveSuccesses).toBe(0);
    expect(next.deathSaveFailures).toBe(0);
  });

  it('keeps the marks when it heals nothing', () => {
    const next = nextSheetAfterRest(
      sheetOf({ hpCurrent: 0, deathSaveSuccesses: 2, deathSaveFailures: 1 }),
      { type: 'short', diceSpent: 0, healingRolled: 0 }
    );

    expect(next.deathSaveSuccesses).toBe(2);
    expect(next.deathSaveFailures).toBe(1);
  });
});

describe('long rest', () => {
  const long = { type: 'long' } as const;

  it('fills hp, clears temp hp and the death saves', () => {
    const next = nextSheetAfterRest(
      sheetOf({ hpCurrent: 0, deathSaveFailures: 2 }),
      long
    );

    expect(next.hpCurrent).toBe(13);
    expect(next.tempHp).toBe(0);
    expect(next.deathSaveFailures).toBe(0);
  });

  it('regains half the total hit dice, rounded down', () => {
    const next = nextSheetAfterRest(
      sheetOf({ level: 5, hitDiceRemaining: 0 }),
      long
    );

    expect(next.hitDiceRemaining).toBe(2);
  });

  it('never regains past the total', () => {
    const next = nextSheetAfterRest(
      sheetOf({ level: 5, hitDiceRemaining: 4 }),
      long
    );

    expect(next.hitDiceRemaining).toBe(5);
  });

  it('restores slots for a non-pact caster too', () => {
    const next = nextSheetAfterRest(
      sheetOf({
        spellcastingProgression: 'full',
        spellSlots: slots({ '1': 1 }, { '1': 4, '2': 3 }),
      }),
      long
    );

    expect(next.spellSlots.current).toEqual({ '1': 4, '2': 3 });
  });

  it('leaves a pool with no maxima recorded exactly as it is', () => {
    const next = nextSheetAfterRest(
      sheetOf({
        spellcastingProgression: 'full',
        spellSlots: slots({ '1': 1 }),
      }),
      long
    );

    expect(next.spellSlots).toEqual({ current: { '1': 1 } });
  });

  it('leaves a newborn sheet at zero rather than inventing hp', () => {
    const next = nextSheetAfterRest(sheetOf({ hpMax: 0, hpCurrent: 0 }), long);

    expect(next.hpCurrent).toBe(0);
  });
});

describe('hitDiceRegained', () => {
  it('is at least one, so levels 1-3 still regain a die', () => {
    expect(hitDiceRegained(1)).toBe(1);
    expect(hitDiceRegained(3)).toBe(1);
  });

  it('rounds down above that', () => {
    expect(hitDiceRegained(5)).toBe(2);
    expect(hitDiceRegained(20)).toBe(10);
  });
});

describe('restoredSlots', () => {
  it('copies max over current without dropping max', () => {
    expect(restoredSlots(slots({ '1': 0 }, { '1': 4 }))).toEqual({
      current: { '1': 4 },
      max: { '1': 4 },
    });
  });

  it('is a no-op for an empty max half', () => {
    expect(restoredSlots(slots({ '1': 2 }, {}))).toEqual({
      current: { '1': 2 },
      max: {},
    });
  });
});
