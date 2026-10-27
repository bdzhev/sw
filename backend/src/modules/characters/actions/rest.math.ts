import type { characterSheets } from '@shared/db';

import type { RestInput } from './rest.schemas';

type SheetRow = typeof characterSheets.$inferSelect;

/** `{ current: { '1'..'9': int }, max: ... }`, as stored in the jsonb column. */
export interface SpellSlots {
  current: Record<string, number>;
  max?: Record<string, number>;
}

/** Exactly the sheet columns a rest writes. Everything else is left alone. */
export interface RestSheetUpdate {
  hpCurrent: number;
  hitDiceRemaining: number;
  tempHp: number;
  deathSaveSuccesses: number;
  deathSaveFailures: number;
  spellSlots: SpellSlots;
}

const NO_SLOTS: SpellSlots = { current: {} };

export const readSpellSlots = (value: unknown): SpellSlots => {
  const slots = value as SpellSlots | null;

  return slots ?? NO_SLOTS;
};

/**
 * `current = max`, or the untouched pool when no maxima are recorded.
 *
 * A row written before maxima were stored has no `max` half, and there is no
 * progression table to fall back on any more — the player types their own. So
 * the honest answer is to leave the pool as it is and let the summary say so,
 * rather than resetting it to an empty object and wiping the counters.
 */
export const restoredSlots = (slots: SpellSlots): SpellSlots => {
  if (!slots.max || Object.keys(slots.max).length === 0) {
    return slots;
  }

  return { ...slots, current: { ...slots.max } };
};

/**
 * Hit dice regained on a long rest: half the total, **rounded down**, minimum
 * one, and never above the total. Total hit dice is the level — there is no
 * multiclassing here, so no per-class split to track.
 */
export const hitDiceRegained = (level: number): number => {
  return Math.max(1, Math.floor(level / 2));
};

/**
 * Regaining a hit point ends the dying state, so the marks go with it. Mirrors
 * `withDeathSaveReset` on the frontend, which applies the same rule to the
 * autosave channel: healing from zero has to behave identically whichever
 * channel did the healing.
 */
const clearedDeathSaves = (sheet: SheetRow, hpCurrent: number): boolean => {
  return sheet.hpCurrent === 0 && hpCurrent > 0;
};

const applyShortRest = (
  sheet: SheetRow,
  diceSpent: number,
  healingRolled: number
): RestSheetUpdate => {
  const slots = readSpellSlots(sheet.spellSlots);
  const hpCurrent = Math.min(sheet.hpCurrent + healingRolled, sheet.hpMax);
  const isRevived = clearedDeathSaves(sheet, hpCurrent);

  return {
    hpCurrent,
    hitDiceRemaining: sheet.hitDiceRemaining - diceSpent,
    tempHp: sheet.tempHp,
    deathSaveSuccesses: isRevived ? 0 : sheet.deathSaveSuccesses,
    deathSaveFailures: isRevived ? 0 : sheet.deathSaveFailures,
    // Pact magic is the one pool a short rest refills, and `progression` is the
    // only honest signal for it — a warlock who overrode theirs to `custom` is
    // a case the dialog's copy covers, not one this guesses at.
    spellSlots:
      sheet.spellcastingProgression === 'pact' ? restoredSlots(slots) : slots,
  };
};

const applyLongRest = (sheet: SheetRow): RestSheetUpdate => {
  return {
    hpCurrent: sheet.hpMax,
    hitDiceRemaining: Math.min(
      sheet.level,
      sheet.hitDiceRemaining + hitDiceRegained(sheet.level)
    ),
    // Temp hp last until depleted or a long rest. Stored, so the rest applies
    // it like every other reset.
    tempHp: 0,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    spellSlots: restoredSlots(readSpellSlots(sheet.spellSlots)),
  };
};

/**
 * The whole of the rest arithmetic, as a pure function over one sheet row, so
 * every rule above is testable without a database. The collections reset by
 * their own UPDATEs in the service — they need no arithmetic at all now that
 * maxima are stored per row.
 */
export const nextSheetAfterRest = (
  sheet: SheetRow,
  input: RestInput
): RestSheetUpdate => {
  if (input.type === 'long') {
    return applyLongRest(sheet);
  }

  return applyShortRest(sheet, input.diceSpent, input.healingRolled);
};
