import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { CharacterClass, CharacterRace } from '@shared/api/characters';
import { NAME_MAX_LENGTH } from '@shared/config/characters';
import { NO_CONTROL_CHARS } from '@shared/lib/regex';

const schema = z.object({
  /** `trim()` before `min(1)`, so an all-spaces name fails. */
  name: z
    .string()
    .trim()
    .min(1, 'Please enter a name')
    .max(NAME_MAX_LENGTH, `At most ${NAME_MAX_LENGTH} characters`)
    .regex(NO_CONTROL_CHARS, 'No line breaks or control characters'),
  characterClass: z.nativeEnum(CharacterClass),
  race: z.nativeEnum(CharacterRace),
});

export const createCharacterSchema = toTypedSchema(schema);
