import type { SpellSlots } from '@shared/api/characters';

import type { SlotMaxima } from '@entities/characters';

import { MAX_SLOT_LEVEL } from '@widgets/character-sheet/config/spellcasting';

export interface CastableSlot {
  slotLevel: number;
  current: number;
  max: number;
}

/**
 * Every slot level the character actually has a pool at.
 *
 * A level counts if it has a max *or* something currently in it — the two are
 * typed independently, and a player who filled in `current` without `max` must
 * not find their slots have vanished.
 *
 * The collapsed slot summary and the cast picker both read this, so the levels
 * one shows cannot drift from the levels the other offers.
 */
export const slotPools = (slots: SpellSlots): CastableSlot[] => {
  const levels: CastableSlot[] = [];

  for (let slotLevel = 1; slotLevel <= MAX_SLOT_LEVEL; slotLevel += 1) {
    const pool = slotAt(slots, slotLevel);

    if (pool.max > 0 || pool.current > 0) {
      levels.push(pool);
    }
  }

  return levels;
};

/**
 * The pools that could carry a spell of `spellLevel` — its own level and
 * everything above it, which is upcasting.
 *
 * The app knows the rule but not the intent, so this only lists the options; it
 * does not pick one. Burning a 5th-level slot on a fireball by accident is a
 * worse failure than one extra tap. Levels with a pool but nothing left come
 * back at `current: 0`, so the picker shows them spent rather than pretending
 * they never existed.
 */
export const castableSlots = (spellLevel: number, slots: SpellSlots): CastableSlot[] => {
  return slotPools(slots).filter((pool) => {
    return pool.slotLevel >= spellLevel;
  });
};

/** Whether anything at or above the spell's level is left to spend. */
export const canCast = (spellLevel: number, slots: SpellSlots): boolean => {
  return castableSlots(spellLevel, slots).some((slot) => {
    return slot.current > 0;
  });
};

/** One level's pool, defaulted. `max` is optional in the type; `current` is not. */
export const slotAt = (slots: SpellSlots, slotLevel: number): CastableSlot => {
  const key = String(slotLevel);

  return {
    slotLevel,
    current: slots.current[key] ?? 0,
    max: slots.max?.[key] ?? 0,
  };
};

/**
 * The three writes, and the one rule they all obey: **return the whole
 * `spellSlots` object.** The autosave buffer merges pending patches shallowly by
 * sheet field — last write wins, no deep merge — so sending half of it would
 * drop the other half if an edit were still queued. That rule was written out
 * twice and applied at four call sites; it lives here now.
 *
 * Absolute values, never deltas, so a resend is idempotent.
 */
export const withSlotCurrent = (
  slots: SpellSlots,
  slotLevel: number,
  value: number,
): SpellSlots => {
  return { ...slots, current: { ...slots.current, [String(slotLevel)]: value } };
};

export const withSlotMax = (
  slots: SpellSlots,
  slotLevel: number,
  value: number,
): SpellSlots => {
  return { ...slots, max: { ...slots.max, [String(slotLevel)]: value } };
};

/** The fill-from-table action. Replaces every max, leaves `current` alone. */
export const withSlotMaxima = (slots: SpellSlots, maxima: SlotMaxima): SpellSlots => {
  return { ...slots, max: maxima };
};

/** Spending one at a level, floored at zero. */
export const withSlotSpent = (slots: SpellSlots, slotLevel: number): SpellSlots => {
  const spent = Math.max(0, slotAt(slots, slotLevel).current - 1);

  return withSlotCurrent(slots, slotLevel, spent);
};

/**
 * How the pips read a pool. A player who typed a current above their max still
 * gets every slot drawn, which is why `total` is a max rather than just `max`.
 */
export const slotSpentCount = (pool: CastableSlot): number => {
  return Math.max(0, pool.max - pool.current);
};

export const slotTotalCount = (pool: CastableSlot): number => {
  return Math.max(pool.max, pool.current);
};
