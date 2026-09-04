import { z } from 'zod';

import { resetTriggerEnum } from '@shared/db';

import {
  counter,
  description,
  isNotEmptyPatch,
  name,
  PATCH_EMPTY_MESSAGE,
  pinnable,
  sortOrder,
} from '../collection.schemas';

export const resourceFields = z.object({
  /** Key into the hardcoded resource list, or the freeform name if custom. */
  resourceKey: name,
  isCustom: z.boolean(),
  /**
   * Null unless `isCustom`. A stored max for Rage would go stale at levels
   * 3/6/12/17, so known resources derive theirs from the class table at render.
   */
  maxValue: counter.nullable(),
  current: counter,
  /**
   * Stored on every row, including known ones, because the rest endpoint needs
   * to know what resets without the backend owning a copy of the class table.
   */
  resetTrigger: z.enum(resetTriggerEnum.enumValues),
  description,
  ...pinnable,
  sortOrder,
});

export const createResourceSchema = resourceFields.partial({
  isCustom: true,
  maxValue: true,
  current: true,
  description: true,
  quickReference: true,
  pinOrder: true,
  sortOrder: true,
});

export const updateResourceSchema = resourceFields
  .partial()
  .strict()
  .refine(isNotEmptyPatch, { message: PATCH_EMPTY_MESSAGE });
