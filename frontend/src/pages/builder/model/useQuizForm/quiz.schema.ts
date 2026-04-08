import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

import type { QuizItem } from "@shared/api/quiz";
import { QUIZ_STATS } from "@shared/api/quiz";

export const createQuizSchema = (items: QuizItem[]) => {
  const shape = Object.fromEntries(
    items.map((item) => {
      return [item.id, z.enum(QUIZ_STATS)];
    }),
  );

  return toTypedSchema(z.object(shape));
};
