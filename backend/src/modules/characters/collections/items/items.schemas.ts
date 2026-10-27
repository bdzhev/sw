import { z } from 'zod';

import {
  counter,
  description,
  isNotEmptyPatch,
  name,
  PATCH_EMPTY_MESSAGE,
  pinnable,
  sortOrder,
} from '../collection.schemas';

const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
const MAX_MODIFIER = 20;

export const itemFields = z.object({
  name,
  description,
  quantity: counter,
  maxUses: counter.nullable(),
  usesRemaining: counter.nullable(),
  resetOnLongRest: z.boolean(),
  /**
   * Item bonuses live here and the totals are *derived* on the frontend. Storing
   * a total on the sheet row would make an item write a second writer of the
   * autosave row, racing the controller.
   */
  statModifiers: z.partialRecord(
    z.enum(ABILITY_KEYS),
    z.number().int().min(-MAX_MODIFIER).max(MAX_MODIFIER)
  ),
  /** Only equipped items grant their bonuses. */
  isEquipped: z.boolean(),
  ...pinnable,
  sortOrder,
});

export const createItemSchema = itemFields.partial({
  description: true,
  quantity: true,
  maxUses: true,
  usesRemaining: true,
  resetOnLongRest: true,
  statModifiers: true,
  isEquipped: true,
  quickReference: true,
  pinOrder: true,
  sortOrder: true,
});

export const updateItemSchema = itemFields
  .partial()
  .strict()
  .refine(isNotEmptyPatch, { message: PATCH_EMPTY_MESSAGE });
