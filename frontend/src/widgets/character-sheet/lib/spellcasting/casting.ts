import type { SpellSlots } from '@shared/api/characters';

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
    const key = String(slotLevel);
    const max = slots.max?.[key] ?? 0;
    const current = slots.current[key] ?? 0;

    if (max > 0 || current > 0) {
      levels.push({ slotLevel, current, max });
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
