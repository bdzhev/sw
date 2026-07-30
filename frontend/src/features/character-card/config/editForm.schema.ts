import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { NAME_MAX_LENGTH } from '@shared/config/characters';
import { NO_CONTROL_CHARS } from '@shared/lib/regex';

const schema = z.object({
  /** Kept in step with the create schema. */
  name: z
    .string()
    .trim()
    .min(1, 'Please enter a name')
    .max(NAME_MAX_LENGTH, `At most ${NAME_MAX_LENGTH} characters`)
    .regex(NO_CONTROL_CHARS, 'No line breaks or control characters'),
});

export const editCharFormSchema = toTypedSchema(schema);
