import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

import { AttackAbility, AttackDelivery } from '@shared/api/characters';

import {
  ADDITIONAL_BONUS_LIMIT,
  AMMO_LIMIT,
  ATTACK_NAME_MAX_LENGTH,
  DAMAGE_DICE_MAX_LENGTH,
} from '@widgets/character-sheet/config/combat/constants';

const WHOLE_NUMBER = /^-?\d*$/;
const POSITIVE_WHOLE_NUMBER = /^\d*$/;

/**
 * The two numeric fields stay strings in form state: they are bound to shared
 * `Input`, whose `v-model` on a number input hands back a string anyway, and an
 * empty string is the "not set" the row stores as 0 / null.
 */
const attackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter a name')
    .max(ATTACK_NAME_MAX_LENGTH, `At most ${ATTACK_NAME_MAX_LENGTH} characters`),
  ability: z.nativeEnum(AttackAbility),
  delivery: z.nativeEnum(AttackDelivery),
  proficient: z.boolean(),
  damageDice: z
    .string()
    .trim()
    .max(DAMAGE_DICE_MAX_LENGTH, `At most ${DAMAGE_DICE_MAX_LENGTH} characters`),
  damageType: z.string(),
  additionalBonus: z
    .string()
    .trim()
    .regex(WHOLE_NUMBER, 'Whole numbers only')
    .refine((raw) => {
      return raw === '' || raw === '-' || Math.abs(Number(raw)) <= ADDITIONAL_BONUS_LIMIT;
    }, `Between -${ADDITIONAL_BONUS_LIMIT} and ${ADDITIONAL_BONUS_LIMIT}`),
  ammoRemaining: z
    .string()
    .trim()
    .regex(POSITIVE_WHOLE_NUMBER, 'Whole numbers only')
    .refine((raw) => {
      return raw === '' || Number(raw) <= AMMO_LIMIT;
    }, `At most ${AMMO_LIMIT}`),
  properties: z.array(z.string()),
});

export const attackFormSchema = toTypedSchema(attackSchema);
