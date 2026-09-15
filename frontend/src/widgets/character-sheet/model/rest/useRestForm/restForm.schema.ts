import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { HEALING_ROLLED_LIMIT } from '@widgets/character-sheet/config/rest';

/**
 * Both fields are text inputs with `input-mode="numeric"`, not `type="number"`
 * — same shape as the resource spend form, so `v-model` never casts and the
 * refines see the raw string.
 *
 * Blank means zero in both: a short rest that spends no dice is legal (it still
 * resets short-trigger resources), and typing 0 for healing should not be
 * required to take one.
 */
const wholeNumber = z.string().trim().regex(/^\d*$/, 'Whole numbers only');

export const restFormSchema = (remainingDice: number) => {
  return toTypedSchema(
    z.object({
      diceSpent: wholeNumber.refine(
        (raw) => {
          return Number(raw || '0') <= remainingDice;
        },
        { message: `Only ${remainingDice} hit dice left` },
      ),
      healingRolled: wholeNumber.refine(
        (raw) => {
          return Number(raw || '0') <= HEALING_ROLLED_LIMIT;
        },
        { message: `At most ${HEALING_ROLLED_LIMIT}` },
      ),
    }),
  );
};
