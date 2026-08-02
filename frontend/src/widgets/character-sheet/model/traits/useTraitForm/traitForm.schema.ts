import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { TraitTag } from '@shared/api/characters';
import { NO_CONTROL_CHARS } from '@shared/lib/regex';

import {
  DESCRIPTION_MAX_LENGTH,
  TRAIT_NAME_MAX_LENGTH,
} from '@widgets/character-sheet/config/traits';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter a name')
    .max(TRAIT_NAME_MAX_LENGTH, `At most ${TRAIT_NAME_MAX_LENGTH} characters`)
    .regex(NO_CONTROL_CHARS, 'No line breaks or control characters'),
  /** Required and never inferred — the player decides where a trait belongs. */
  tag: z.nativeEnum(TraitTag, { required_error: 'Please pick a tag' }),
  description: z.string().max(DESCRIPTION_MAX_LENGTH, 'That is too long'),
  quickReference: z.boolean(),
});

export const traitFormSchema = toTypedSchema(schema);
