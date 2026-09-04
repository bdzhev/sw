import { zValidator } from '@hono/zod-validator';
import { and, asc, ilike, lte, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { Hono } from 'hono';

import { db, spells } from '@shared/db';
import type { AuthVariables } from '@shared/middleware';
import { errorHook } from '@shared/validation';

import { spellSearchQuerySchema } from './spells.schemas';

export { SPELL_PAGE_SIZE } from './spells.schemas';

/**
 * The shared reference library — read-only, and the same rows for every user.
 * The character's own list lives under `/character/:id/spells`.
 */
export const spellsRoutes = new Hono<{ Variables: AuthVariables }>();

/** `%` and `_` are LIKE wildcards; a spell named "Wall of ..." must not match them. */
const escapeLikePattern = (value: string): string => {
  return value.replace(/[\\%_]/g, (char) => {
    return `\\${char}`;
  });
};

spellsRoutes.get(
  '/search',
  zValidator('query', spellSearchQuerySchema, errorHook),
  async (c) => {
    const {
      q,
      class: characterClass,
      maxLevel,
      offset,
      limit,
    } = c.req.valid('query');

    try {
      const filters: SQL[] = [];

      if (q) {
        filters.push(ilike(spells.name, `%${escapeLikePattern(q)}%`));
      }

      if (characterClass) {
        // `@>` containment against the flattened class-key array the seed writes.
        filters.push(
          sql`${spells.classes} @> ${JSON.stringify([characterClass])}::jsonb`
        );
      }

      if (maxLevel !== undefined) {
        filters.push(lte(spells.level, maxLevel));
      }

      const where = filters.length > 0 ? and(...filters) : undefined;

      const [items, total] = await Promise.all([
        db
          .select()
          .from(spells)
          .where(where)
          // Deterministic order is required, not cosmetic: LIMIT/OFFSET over an
          // unordered result lets a row repeat across pages or never appear at
          // all. `spells` has no created_at, so `id` is the unique tail.
          .orderBy(
            asc(spells.level),
            asc(sql`lower(${spells.name})`),
            asc(spells.id)
          )
          .limit(limit)
          .offset(offset),
        db.$count(spells, where),
      ]);

      return c.json({ items, total });
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to search spells' }, 500);
    }
  }
);
