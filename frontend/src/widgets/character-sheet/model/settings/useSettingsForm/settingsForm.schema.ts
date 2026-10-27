import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { NAME_MAX_LENGTH } from '@shared/config/characters';
import { NO_CONTROL_CHARS } from '@shared/lib/regex';

import { FREE_TEXT_MAX_LENGTH } from '@widgets/character-sheet/config/header';

/** Line breaks are the point of a lore field, so no `NO_CONTROL_CHARS` here. */
const freeText = z
  .string()
  .max(FREE_TEXT_MAX_LENGTH, `At most ${FREE_TEXT_MAX_LENGTH} characters`)
  .default('');

const schema = z.object({
  /** Kept in step with the create schema and the dashboard's rename. */
  name: z
    .string()
    .trim()
    .min(1, 'Please enter a name')
    .max(NAME_MAX_LENGTH, `At most ${NAME_MAX_LENGTH} characters`)
    .regex(NO_CONTROL_CHARS, 'No line breaks or control characters'),
  lore: freeText,
  appearance: freeText,
});

export const settingsFormSchema = toTypedSchema(schema);
