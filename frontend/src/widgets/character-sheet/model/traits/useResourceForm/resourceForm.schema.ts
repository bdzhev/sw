import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { ResetTrigger } from '@shared/api/characters';
import { NO_CONTROL_CHARS } from '@shared/lib/regex';

import {
  CUSTOM_RESOURCE_VALUE,
  DESCRIPTION_MAX_LENGTH,
  RESOURCE_NAME_MAX_LENGTH,
  RESOURCE_VALUE_LIMIT,
} from '@widgets/character-sheet/config/traits';

/**
 * `undefined` is a blank box, and blank means "unknown max" — not zero, which is
 * a real pool that happens to be empty. `NumberField` parses and clamps, so
 * there is nothing to validate here beyond the range.
 */
const wholePoolNumber = z
  .number()
  .int('Whole numbers only')
  .min(0, 'Cannot be negative')
  .max(RESOURCE_VALUE_LIMIT, `At most ${RESOURCE_VALUE_LIMIT}`)
  .optional();

const schema = z
  .object({
    resource: z.string().min(1, 'Please pick a resource'),
    customName: z
      .string()
      .trim()
      .max(RESOURCE_NAME_MAX_LENGTH, `At most ${RESOURCE_NAME_MAX_LENGTH} characters`)
      .regex(NO_CONTROL_CHARS, 'No line breaks or control characters')
      .or(z.literal('')),
    maxValue: wholePoolNumber,
    current: wholePoolNumber,
    resetTrigger: z.nativeEnum(ResetTrigger, { required_error: 'Please pick a trigger' }),
    description: z.string().max(DESCRIPTION_MAX_LENGTH, 'That is too long'),
    quickReference: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.resource !== CUSTOM_RESOURCE_VALUE) return;

    if (!values.customName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['customName'],
        message: 'Please name the resource',
      });
    }

    // A homebrew pool has no table to fall back on, so its max is mandatory.
    // `undefined` only — 0 is a deliberate answer, even if a useless pool.
    if (values.maxValue === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxValue'],
        message: 'Enter a max for a custom resource',
      });
    }
  });

export const resourceFormSchema = toTypedSchema(schema);
