import { RestType } from '@shared/api/characters';

export const REST_LABELS: Record<RestType, string> = {
  [RestType.SHORT]: 'Short rest',
  [RestType.LONG]: 'Long rest',
};

export const REST_DESCRIPTIONS: Record<RestType, string> = {
  [RestType.SHORT]: 'Spend hit dice, roll them yourself, and type the total you healed.',
  [RestType.LONG]:
    'Hit points, spell slots, long-rest resources and item uses all come back.',
};

export const REST_SUBMIT_LABELS: Record<RestType, string> = {
  [RestType.SHORT]: 'Take a short rest',
  [RestType.LONG]: 'Take a long rest',
};

export const RESTING_LABELS: Record<RestType, string> = {
  [RestType.SHORT]: 'Napping…',
  [RestType.LONG]: 'Resting…',
};

/** The dice roll is the player's; the app only records what it came to. */
export const HEALING_ROLLED_LIMIT = 999;

export const DICE_SPENT_HINT = 'Roll them physically — the app has no dice.';

/**
 * Pact magic is gated on the stored progression, not on class, so a warlock who
 * overrode theirs to `custom` sees the second line and knows why.
 */
export const PACT_SLOTS_HINT = 'Pact magic: your spell slots come back too.';

export const SHORT_REST_SLOTS_HINT =
  'Spell slots only come back on a long rest — unless your progression is set to pact magic.';

export const REST_SUMMARY_TITLE = 'Rested';

export const NO_CHANGES_LINE = 'Nothing needed restoring.';

export const REST_ERROR_TITLE = 'Could not rest';
