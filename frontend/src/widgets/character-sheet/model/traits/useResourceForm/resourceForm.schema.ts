import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { ResetTrigger } from '@shared/api/characters';
import { NO_CONTROL_CHARS } from '@shared/lib/regex';

import {
  CUSTOM_RESOURCE_VALUE,
  DESCRIPTION_MAX_LENGTH,
  RESOURCE_NAME_MAX_LENGTH,
} from '@widgets/character-sheet/config/traits';

/** Number inputs hand back strings, and "" is the meaningful "unknown max". */
const wholeNumberText = z.string().trim().regex(/^\d*$/, 'Whole numbers only');

const schema = z
  .object({
    resource: z.string().min(1, 'Please pick a resource'),
    customName: z
      .string()
      .trim()
      .max(RESOURCE_NAME_MAX_LENGTH, `At most ${RESOURCE_NAME_MAX_LENGTH} characters`)
      .regex(NO_CONTROL_CHARS, 'No line breaks or control characters')
      .or(z.literal('')),
    maxValue: wholeNumberText,
    current: wholeNumberText,
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
    if (!values.maxValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxValue'],
        message: 'Enter a max for a custom resource',
      });
    }
  });

export const resourceFormSchema = toTypedSchema(schema);
