import { z } from 'zod';

const MAX_COUNTER = 9999;

const counter = z.number().int().min(0).max(MAX_COUNTER);

/**
 * A discriminated union rather than one object with optional extras: a long
 * rest takes no input at all, so `{ type: 'long', diceSpent: 3 }` is a client
 * that believes it spent dice. Both members are `.strict()`, which turns that
 * into a 400 instead of a silent drop — same reasoning as the PATCH schemas.
 *
 * Maxima are deliberately absent. They are stored on the rows the endpoint
 * already reads (`class_resources.max_value`, `spell_slots.max`), so the only
 * inputs here are the two numbers the player owns.
 */
export const restSchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal('short'),
      /** Zero is legal: a short rest still resets short-trigger resources. */
      diceSpent: counter,
      /** Rolled physically — the app has no dice roller anywhere. */
      healingRolled: counter,
    })
    .strict(),
  z.object({ type: z.literal('long') }).strict(),
]);

export type RestInput = z.infer<typeof restSchema>;
