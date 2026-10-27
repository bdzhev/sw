import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { NO_CONTROL_CHARS } from '@shared/lib/regex';

import {
  MAX_SLOT_LEVEL,
  SPELL_DESCRIPTION_MAX_LENGTH,
  SPELL_NAME_MAX_LENGTH,
} from '@widgets/character-sheet/config/spellcasting';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter a name')
    .max(SPELL_NAME_MAX_LENGTH, `At most ${SPELL_NAME_MAX_LENGTH} characters`)
    .regex(NO_CONTROL_CHARS, 'No line breaks or control characters'),
  /**
   * Required and never guessed. A wrong default would quietly decide whether
   * the entry can be cast at all, and at what cost.
   */
  level: z
    .number({ required_error: 'Please pick a level' })
    .int()
    .min(0)
    .max(MAX_SLOT_LEVEL),
  description: z.string().max(SPELL_DESCRIPTION_MAX_LENGTH, 'That is too long'),
});

export const spellFormSchema = toTypedSchema(schema);
