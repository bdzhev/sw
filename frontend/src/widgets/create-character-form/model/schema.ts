import { toTypedSchema } from '@vee-validate/zod';
import z4 from 'zod/v4';

import { CharacterClass, CharacterRace } from '@shared/api/characters';
import { ONLY_LETTERS_SPACES_APOSTROPHE } from '@shared/lib/regex';

const schema = z4.object({
  name: z4
    .string()
    .min(1, 'Please enter a name')
    .regex(ONLY_LETTERS_SPACES_APOSTROPHE, 'Only letters are allowed'),
  class: z4.enum(CharacterClass),
  race: z4.enum(CharacterRace),
});

export const createCharacterSchema = toTypedSchema(schema);
