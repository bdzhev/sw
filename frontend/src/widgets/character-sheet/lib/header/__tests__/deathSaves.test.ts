import { describe, expect, it } from 'vitest';

import type { CharacterSheet, SheetPatch } from '@shared/api/characters';

import { withDeathSaveReset } from '../deathSaves';

/** Only the three fields the helper reads. */
const sheet = (
  hpCurrent: number,
  deathSaveSuccesses = 0,
  deathSaveFailures = 0,
): CharacterSheet => {
  return { hpCurrent, deathSaveSuccesses, deathSaveFailures } as CharacterSheet;
};

describe('withDeathSaveReset', () => {
  it('clears both counters when a dying character regains a hit point', () => {
    const patch: SheetPatch = { hpCurrent: 1 };

    expect(withDeathSaveReset(patch, sheet(0, 2, 1))).toEqual({
      hpCurrent: 1,
      deathSaveSuccesses: 0,
      deathSaveFailures: 0,
    });
  });

  /** Nothing to clear, so the patch must pass through by identity. */
  it('returns the patch untouched when there are no marks', () => {
    const patch: SheetPatch = { hpCurrent: 1 };

    expect(withDeathSaveReset(patch, sheet(0, 0, 0))).toBe(patch);
  });

  it('leaves the patch alone when the character was not dying', () => {
    const patch: SheetPatch = { hpCurrent: 5 };

    expect(withDeathSaveReset(patch, sheet(3, 2, 1))).toBe(patch);
  });

  it('leaves the patch alone when hp goes to zero rather than up', () => {
    const patch: SheetPatch = { hpCurrent: 0 };

    expect(withDeathSaveReset(patch, sheet(0, 2, 1))).toBe(patch);
  });

  /** A patch that does not mention hp cannot revive anyone. */
  it('leaves an unrelated patch alone', () => {
    const patch: SheetPatch = { ac: 15 };

    expect(withDeathSaveReset(patch, sheet(0, 2, 1))).toBe(patch);
  });

  it('preserves the rest of the patch it folds into', () => {
    const patch: SheetPatch = { hpCurrent: 1, tempHp: 4 };

    expect(withDeathSaveReset(patch, sheet(0, 1, 0))).toEqual({
      hpCurrent: 1,
      tempHp: 4,
      deathSaveSuccesses: 0,
      deathSaveFailures: 0,
    });
  });
});
