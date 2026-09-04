import { z } from 'zod';

import {
  attackAbilityEnum,
  attackDeliveryEnum,
  damageTypeEnum,
} from '@shared/db';

import {
  counter,
  isNotEmptyPatch,
  name,
  PATCH_EMPTY_MESSAGE,
  pinnable,
  sortOrder,
} from '../collection.schemas';

const MAX_DICE_LENGTH = 40;
const MAX_BONUS = 99;

export const attackFields = z.object({
  name,
  ability: z.enum(attackAbilityEnum.enumValues),
  delivery: z.enum(attackDeliveryEnum.enumValues),
  proficient: z.boolean(),
  /** Freeform ("1d8") — matches how players write it on paper. */
  damageDice: z.string().max(MAX_DICE_LENGTH).nullable(),
  damageType: z.enum(damageTypeEnum.enumValues).nullable(),
  /** Numeric, feeds attack and damage both. Extra damage *dice* don't fit. */
  additionalBonus: z.number().int().min(-MAX_BONUS).max(MAX_BONUS),
  /** Only meaningful for thrown / ranged-firearm; the UI gates the field. */
  ammoRemaining: counter.nullable(),
  properties: z.array(z.string().max(MAX_DICE_LENGTH)),
  ...pinnable,
  sortOrder,
});

export const createAttackSchema = attackFields.partial({
  proficient: true,
  damageDice: true,
  damageType: true,
  additionalBonus: true,
  ammoRemaining: true,
  properties: true,
  quickReference: true,
  pinOrder: true,
  sortOrder: true,
});

export const updateAttackSchema = attackFields
  .partial()
  .strict()
  .refine(isNotEmptyPatch, { message: PATCH_EMPTY_MESSAGE });
