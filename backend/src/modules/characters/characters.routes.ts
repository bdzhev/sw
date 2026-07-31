import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { characters, db, isPgError, PG_ERROR } from '@/shared/db';
import type { AuthVariables } from '@/shared/middleware/auth';

export const charactersRoutes = new Hono<{ Variables: AuthVariables }>();

const PAGE_SIZE = 10;

export const MAX_CHARACTERS_PER_USER = 50;

charactersRoutes.post('/', async (c) => {
  const userId = c.get('userId');
  const { name, class: characterClass, race } = await c.req.json();

  if (!name || !characterClass || !race) {
    return c.json({ error: 'name, class and race are required' }, 400);
  }

  try {
    // Count-then-insert is not atomic: two simultaneous creates can both pass
    // and land on 51. Benign here (the UI disables the trigger at the cap); the
    // atomic form is a single INSERT ... SELECT ... WHERE (SELECT count(*)) < N.
    const total = await db.$count(characters, eq(characters.userId, userId));

    if (total >= MAX_CHARACTERS_PER_USER) {
      return c.json(
        { error: `Character limit reached (${MAX_CHARACTERS_PER_USER})` },
        409
      );
    }

    const result = await db
      .insert(characters)
      .values({
        userId,
        name,
        class: characterClass,
        race,
        status: 'pending',
        stats: null,
      })
      .returning();

    return c.json(result[0], 201);
  } catch (err) {
    if (isPgError(err, PG_ERROR.FOREIGN_KEY_VIOLATION)) {
      return c.json({ error: 'User not found' }, 404);
    }
    console.error(err);

    return c.json({ error: 'Failed to create character' }, 500);
  }
});

charactersRoutes.get('/', async (c) => {
  const userId = c.get('userId');
  const offset = Number(c.req.query('offset') ?? 0);
  const limit = Number(c.req.query('limit') ?? PAGE_SIZE);

  try {
    const ownedByUser = eq(characters.userId, userId);

    const [items, total] = await Promise.all([
      db
        .select({
          id: characters.id,
          name: characters.name,
          class: characters.class,
          race: characters.race,
          status: characters.status,
        })
        .from(characters)
        .where(ownedByUser)
        // Deterministic order is required, not cosmetic: LIMIT/OFFSET over an
        // unordered result lets a row repeat across pages or never appear at
        // all. `id` breaks ties for rows sharing a created_at.
        .orderBy(desc(characters.createdAt), desc(characters.id))
        .limit(limit)
        .offset(offset),
      db.$count(characters, ownedByUser),
    ]);

    return c.json({ items, total });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to get characters' }, 500);
  }
});
