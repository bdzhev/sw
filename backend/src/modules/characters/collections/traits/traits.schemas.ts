import { z } from 'zod';

import { traitTagEnum } from '@shared/db';

import {
  description,
  isNotEmptyPatch,
  name,
  PATCH_EMPTY_MESSAGE,
  pinnable,
  sortOrder,
} from '../collection.schemas';

export const traitFields = z.object({
  name,
  description,
  /** Player-assigned, never auto-tagged. */
  tag: z.enum(traitTagEnum.enumValues),
  ...pinnable,
  sortOrder,
});

export const createTraitSchema = traitFields.partial({
  description: true,
  quickReference: true,
  pinOrder: true,
  sortOrder: true,
});

export const updateTraitSchema = traitFields
  .partial()
  .strict()
  .refine(isNotEmptyPatch, { message: PATCH_EMPTY_MESSAGE });
