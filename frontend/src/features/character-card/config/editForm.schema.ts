import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

import { ONLY_LETTERS_SPACES_APOSTROPHE } from "@shared/lib/regex";

const schema = z.object({
  name: z.string().min(1).max(30).regex(ONLY_LETTERS_SPACES_APOSTROPHE),
});

export const editCharFormSchema = toTypedSchema(schema);
