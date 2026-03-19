import { toTypedSchema } from '@vee-validate/zod';
import z4 from 'zod/v4';

import { ONLY_LETTERS_SPACES_APOSTROPHE } from '@shared/lib/regex';

const schema = z4.object({
  name: z4.string().min(1).max(30).regex(ONLY_LETTERS_SPACES_APOSTROPHE),
});

export const editCharFormSchema = toTypedSchema(schema);
