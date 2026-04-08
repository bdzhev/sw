import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { CharacterClass, CharacterRace } from '@shared/api/characters';
import { ONLY_LETTERS_SPACES_APOSTROPHE } from '@shared/lib/regex';

const schema = z.object({
  name: z
    .string()
    .min(1, 'Please enter a name')
    .regex(ONLY_LETTERS_SPACES_APOSTROPHE, 'Only letters are allowed'),
  characterClass: z.nativeEnum(CharacterClass),
  race: z.nativeEnum(CharacterRace),
});

export const createCharacterSchema = toTypedSchema(schema);
