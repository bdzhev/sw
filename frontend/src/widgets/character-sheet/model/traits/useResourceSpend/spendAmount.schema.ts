import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

/**
 * Built per resource rather than once at module scope: the ceiling is whatever is
 * left in the pool, which changes on every spend. The field is a text input with
 * `input-mode="numeric"` — not `type="number"`, which would have `v-model` cast
 * to a number — hence the text-then-refine shape.
 */
export const spendAmountSchema = (remaining: number) => {
  return toTypedSchema(
    z.object({
      amount: z
        .string()
        .trim()
        .min(1, 'Enter an amount')
        .regex(/^\d+$/, 'Whole numbers only')
        .refine(
          (raw) => {
            return Number(raw) >= 1;
          },
          { message: 'At least 1' },
        )
        .refine(
          (raw) => {
            return Number(raw) <= remaining;
          },
          { message: `Only ${remaining} left in the pool` },
        ),
    }),
  );
};
