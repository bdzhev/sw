import { describe, expect, it } from 'vitest';

import type { SpellSlots } from '@shared/api/characters';

import {
  canCast,
  castableSlots,
  slotAt,
  slotPools,
  slotSpentCount,
  slotTotalCount,
  withSlotCurrent,
  withSlotMax,
  withSlotMaxima,
  withSlotSpent,
} from '../casting';

describe('slotPools', () => {
  it('lists only the levels with a pool', () => {
    const slots: SpellSlots = { current: { 1: 2 }, max: { 1: 4, 2: 2 } };

    expect(slotPools(slots)).toEqual([
      { slotLevel: 1, current: 2, max: 4 },
      { slotLevel: 2, current: 0, max: 2 },
    ]);
  });

  /**
   * `max` is optional in the type — rows written before slots became
   * player-entered have none — so an absent map must not erase the pools.
   */
  it('survives an absent max map', () => {
    expect(slotPools({ current: { 3: 1 } })).toEqual([
      { slotLevel: 3, current: 1, max: 0 },
    ]);
  });

  /**
   * The documented rule: a level counts on max OR current, so a player who
   * filled in `current` without `max` does not find their slots vanished.
   */
  it('counts a level that has current but no max', () => {
    expect(slotPools({ current: { 2: 1 }, max: {} })).toEqual([
      { slotLevel: 2, current: 1, max: 0 },
    ]);
  });

  it('is empty when nothing is filled in', () => {
    expect(slotPools({ current: {}, max: {} })).toEqual([]);
  });

  it('stops at level nine', () => {
    const slots: SpellSlots = { current: {}, max: { 9: 1, 10: 1 } };

    expect(slotPools(slots)).toEqual([{ slotLevel: 9, current: 0, max: 1 }]);
  });
});

describe('castableSlots', () => {
  it('offers the spell level and everything above it', () => {
    const slots: SpellSlots = {
      current: { 1: 1, 2: 1, 3: 1 },
      max: { 1: 1, 2: 1, 3: 1 },
    };

    expect(
      castableSlots(2, slots).map((pool) => {
        return pool.slotLevel;
      }),
    ).toEqual([2, 3]);
  });

  /** A spent pool still comes back, at `current: 0`, so the picker can show it. */
  it('includes a pool with nothing left', () => {
    const slots: SpellSlots = { current: { 2: 0 }, max: { 2: 3 } };

    expect(castableSlots(1, slots)).toEqual([{ slotLevel: 2, current: 0, max: 3 }]);
  });
});

describe('canCast', () => {
  it('is true when something at or above the level is left', () => {
    expect(canCast(1, { current: { 3: 1 }, max: { 3: 1 } })).toBe(true);
  });

  it('is false when every pool at or above the level is spent', () => {
    expect(canCast(1, { current: { 1: 0, 2: 0 }, max: { 1: 2, 2: 2 } })).toBe(false);
  });

  /** A full lower pool cannot carry a higher spell. */
  it('ignores pools below the spell level', () => {
    expect(canCast(3, { current: { 1: 4 }, max: { 1: 4 } })).toBe(false);
  });
});

describe('slotAt', () => {
  it('defaults both halves to zero', () => {
    expect(slotAt({ current: {} }, 3)).toEqual({ slotLevel: 3, current: 0, max: 0 });
  });

  it('reads a filled level', () => {
    expect(slotAt({ current: { 2: 1 }, max: { 2: 3 } }, 2)).toEqual({
      slotLevel: 2,
      current: 1,
      max: 3,
    });
  });
});

/**
 * The rule every write obeys: return the **whole** `spellSlots` object. The
 * autosave buffer merges pending patches shallowly by sheet field, so a partial
 * write would drop whatever else was still queued.
 */
describe('the slot writes preserve the whole object', () => {
  const slots: SpellSlots = { current: { 1: 2, 2: 1 }, max: { 1: 4, 2: 2 } };

  it('keeps the other levels when setting one current', () => {
    expect(withSlotCurrent(slots, 1, 0)).toEqual({
      current: { 1: 0, 2: 1 },
      max: { 1: 4, 2: 2 },
    });
  });

  it('keeps current when setting a max', () => {
    expect(withSlotMax(slots, 2, 5)).toEqual({
      current: { 1: 2, 2: 1 },
      max: { 1: 4, 2: 5 },
    });
  });

  it('keeps current when replacing every max from the table', () => {
    expect(withSlotMaxima(slots, { 1: 4, 2: 3, 3: 2 })).toEqual({
      current: { 1: 2, 2: 1 },
      max: { 1: 4, 2: 3, 3: 2 },
    });
  });

  it('never mutates the input', () => {
    const before = structuredClone(slots);

    withSlotCurrent(slots, 1, 0);
    withSlotMax(slots, 1, 9);
    withSlotSpent(slots, 1);

    expect(slots).toEqual(before);
  });

  /** `max` is optional in the type; spreading an absent one is legal and yields a fresh map. */
  it('survives an absent max map', () => {
    expect(withSlotMax({ current: { 1: 1 } }, 1, 2)).toEqual({
      current: { 1: 1 },
      max: { 1: 2 },
    });
  });
});

describe('withSlotSpent', () => {
  it('decrements the level cast at', () => {
    expect(withSlotSpent({ current: { 3: 2 }, max: { 3: 3 } }, 3).current).toEqual({
      3: 1,
    });
  });

  it('floors at zero rather than going negative', () => {
    expect(withSlotSpent({ current: { 3: 0 }, max: { 3: 3 } }, 3).current).toEqual({
      3: 0,
    });
  });

  it('treats an absent level as empty', () => {
    expect(withSlotSpent({ current: {} }, 5).current).toEqual({ 5: 0 });
  });
});

describe('the pip arithmetic', () => {
  it('counts spent as the gap below max', () => {
    expect(slotSpentCount({ slotLevel: 1, current: 1, max: 4 })).toBe(3);
  });

  /** An over-filled pool still draws every slot, so total is a max, not `max`. */
  it('draws every slot when current exceeds max', () => {
    expect(slotTotalCount({ slotLevel: 1, current: 6, max: 4 })).toBe(6);
    expect(slotSpentCount({ slotLevel: 1, current: 6, max: 4 })).toBe(0);
  });
});
