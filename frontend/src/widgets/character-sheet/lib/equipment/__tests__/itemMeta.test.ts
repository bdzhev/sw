import { describe, expect, it } from 'vitest';

import { CharacterStat, type InventoryItem } from '@shared/api/characters';

import { hasStatModifiers, modifierSummary, usesPool } from '../itemMeta';

const item = (fields: Partial<InventoryItem>): InventoryItem => {
  return {
    maxUses: null,
    usesRemaining: null,
    statModifiers: {},
    isEquipped: false,
    ...fields,
  } as InventoryItem;
};

describe('usesPool', () => {
  it('reads as a pool when the item tracks uses', () => {
    expect(usesPool(item({ maxUses: 2, usesRemaining: 1 }))).toBe('1 / 2 uses');
  });

  /** Null max means a reference card, not a zero pool. */
  it('is null when the item tracks nothing', () => {
    expect(usesPool(item({ maxUses: null }))).toBeNull();
  });

  it('reads an absent remaining as zero rather than blank', () => {
    expect(usesPool(item({ maxUses: 3, usesRemaining: null }))).toBe('0 / 3 uses');
  });
});

describe('modifierSummary', () => {
  it('is null when the item grants nothing', () => {
    expect(modifierSummary(item({}))).toBeNull();
  });

  it('signs a single bonus', () => {
    expect(modifierSummary(item({ statModifiers: { [CharacterStat.STR]: 2 } }))).toBe(
      'STR +2',
    );
  });

  /**
   * Ordered by the `CharacterStat` enum, which is STR, DEX, WIS, INT, CHA, CON —
   * *not* paper order. Pinned because the point of the ordering is that two
   * items with the same bonuses read identically regardless of key order.
   */
  it('orders by the enum, not by object key order', () => {
    const summary = modifierSummary(
      item({
        statModifiers: {
          [CharacterStat.CON]: 1,
          [CharacterStat.WIS]: 1,
          [CharacterStat.STR]: 1,
        },
      }),
    );

    expect(summary).toBe('STR +1 · WIS +1 · CON +1');
  });

  /** A zero bonus is falsy, so it is filtered out rather than rendered `+0`. */
  it('drops a zero bonus', () => {
    expect(
      modifierSummary(
        item({ statModifiers: { [CharacterStat.STR]: 0, [CharacterStat.DEX]: 2 } }),
      ),
    ).toBe('DEX +2');
  });

  it('keeps a negative bonus', () => {
    expect(modifierSummary(item({ statModifiers: { [CharacterStat.DEX]: -1 } }))).toBe(
      'DEX -1',
    );
  });
});

describe('hasStatModifiers', () => {
  it('agrees with modifierSummary', () => {
    expect(hasStatModifiers(item({}))).toBe(false);
    expect(hasStatModifiers(item({ statModifiers: { [CharacterStat.STR]: 0 } }))).toBe(
      false,
    );
    expect(hasStatModifiers(item({ statModifiers: { [CharacterStat.STR]: 1 } }))).toBe(
      true,
    );
  });
});
