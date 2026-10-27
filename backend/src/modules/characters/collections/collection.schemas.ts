import { z } from 'zod';

const MAX_NAME_LENGTH = 100;
const MAX_TEXT_LENGTH = 4000;
const MAX_SORT_ORDER = 100000;
const MAX_COUNTER = 9999;

export const name = z.string().trim().min(1).max(MAX_NAME_LENGTH);
export const description = z.string().max(MAX_TEXT_LENGTH).nullable();
export const counter = z.number().int().min(0).max(MAX_COUNTER);
export const sortOrder = z.number().int().min(0).max(MAX_SORT_ORDER);

/** The pin mechanism, shared by the four pinnable collections. */
export const pinnable = {
  quickReference: z.boolean(),
  pinOrder: z.number().int().min(0).max(MAX_SORT_ORDER),
};

/**
 * Shared pieces of the sub-collection PATCH shape rather than a wrapper that
 * returns a schema: a wrapper needs an explicit return type (oxlint §7), and
 * Zod 4's `.partial()` inference cannot be restated in one — the annotation
 * either loses the field types or fails to typecheck. Composing at each call
 * site keeps inference exact. See `backend/rules.md` §3.
 *
 * Every sub-collection PATCH is `.partial().strict()` plus this refine, for the
 * same reason the sheet PATCH is: silently dropping a field the client believes
 * it wrote is worse than a 400.
 */
export const PATCH_EMPTY_MESSAGE = 'Patch body is empty';

export const isNotEmptyPatch = (patch: object): boolean => {
  return Object.keys(patch).length > 0;
};
