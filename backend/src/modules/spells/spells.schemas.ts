import { z } from 'zod';

import { characterClassEnum } from '@shared/db';

/** Mirrored by PAGE_SIZE in the frontend's shared/api/spells. */
export const SPELL_PAGE_SIZE = 20;

const MAX_PAGE_SIZE = 100;
const MAX_QUERY_LENGTH = 100;
const MAX_SPELL_LEVEL = 9;

/**
 * Every filter is optional and they compose: the standard search sends
 * `class` + `maxLevel`, the library search sends `q` alone, and no filter at
 * all is a legal (paginated) browse of the whole library.
 */
export const spellSearchQuerySchema = z.object({
  q: z.string().trim().max(MAX_QUERY_LENGTH).optional(),
  class: z.enum(characterClassEnum.enumValues).optional(),
  // Query params arrive as strings; coerce, then bound `limit` so a client
  // cannot ask for the whole table in one page.
  maxLevel: z.coerce.number().int().min(0).max(MAX_SPELL_LEVEL).optional(),
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(SPELL_PAGE_SIZE),
});

export type SpellSearchQuery = z.infer<typeof spellSearchQuerySchema>;
