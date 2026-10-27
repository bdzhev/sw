import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { NO_CONTROL_CHARS } from '@shared/lib/regex';

import {
  ITEM_DESCRIPTION_MAX_LENGTH,
  ITEM_NAME_MAX_LENGTH,
  ITEM_QUANTITY_LIMIT,
  ITEM_USES_LIMIT,
  STAT_MODIFIER_LIMIT,
} from '@widgets/character-sheet/config/equipment';

/** `undefined` is a blank box. `NumberField` parses and clamps; this is the range. */
const wholeNumber = (limit: number) => {
  return z
    .number()
    .int('Whole numbers only')
    .min(0, 'Cannot be negative')
    .max(limit, `At most ${limit}`)
    .optional();
};

const modifier = z
  .number()
  .int('Whole numbers only')
  .min(-STAT_MODIFIER_LIMIT, `At least -${STAT_MODIFIER_LIMIT}`)
  .max(STAT_MODIFIER_LIMIT, `At most ${STAT_MODIFIER_LIMIT}`)
  .optional();

/**
 * Every boolean carries `.default(false)` and the text fields `.default('')`, and
 * that is load-bearing rather than tidiness.
 *
 * vee-validate **deletes a field's path from the form values when its component
 * unmounts**. Several of these live behind a `v-if` — the ability boxes, the uses
 * fields, `resetOnLongRest` — so toggling "Limited uses" on and then off removes
 * `resetOnLongRest` entirely. Against a bare `z.boolean()` that is a `Required`
 * error on a field the user cannot see, `FormSwitch` renders no message, and the
 * form silently refuses to submit with no request and no explanation.
 *
 * `.default()` keeps the parsed output non-optional, so the submit callback still
 * receives real booleans and needs no coercion.
 */
const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Please name the item')
      .max(ITEM_NAME_MAX_LENGTH, `At most ${ITEM_NAME_MAX_LENGTH} characters`)
      .regex(NO_CONTROL_CHARS, 'No line breaks or control characters'),
    quantity: wholeNumber(ITEM_QUANTITY_LIMIT),
    isEquipped: z.boolean().default(false),
    /** Drives whether the six ability boxes are shown, not what is stored. */
    hasBonuses: z.boolean().default(false),
    str: modifier,
    dex: modifier,
    con: modifier,
    int: modifier,
    wis: modifier,
    cha: modifier,
    /** Same: reveals the uses fields rather than being persisted. */
    hasLimitedUses: z.boolean().default(false),
    maxUses: wholeNumber(ITEM_USES_LIMIT),
    usesRemaining: wholeNumber(ITEM_USES_LIMIT),
    resetOnLongRest: z.boolean().default(false),
    description: z
      .string()
      .max(ITEM_DESCRIPTION_MAX_LENGTH, 'That is too long')
      .default(''),
    quickReference: z.boolean().default(false),
  })
  .superRefine((values, ctx) => {
    // Ticking "limited uses" and leaving the max blank would store a tracked item
    // with nothing to track, which renders as a use button that can never fire.
    if (values.hasLimitedUses && values.maxUses === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxUses'],
        message: 'Enter how many uses it has',
      });
    }

    if (
      values.hasLimitedUses &&
      values.maxUses !== undefined &&
      values.usesRemaining !== undefined &&
      values.usesRemaining > values.maxUses
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['usesRemaining'],
        message: 'Cannot exceed the max',
      });
    }
  });

export const itemFormSchema = toTypedSchema(schema);
