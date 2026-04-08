import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { characters, db } from '../../db';
import type { AuthVariables } from '../../middlewares/auth';

export const characterRoutes = new Hono<{ Variables: AuthVariables }>();

characterRoutes.post('/', async (c) => {
  const userId = c.get('userId');
  const { name, class: characterClass, race } = await c.req.json();

  if (!name || !characterClass || !race) {
    return c.json({ error: 'name, class and race are required' }, 400);
  }

  try {
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
  } catch (err: any) {
    if (err?.code === '23503') {
      return c.json({ error: 'User not found' }, 404);
    }
    console.error(err);

    return c.json({ error: 'Failed to create character' }, 500);
  }
});

const PAGE_SIZE = 10;

characterRoutes.get('/', async (c) => {
  const userId = c.get('userId');
  const offset = Number(c.req.query('offset') ?? 0);
  const limit = Number(c.req.query('limit') ?? PAGE_SIZE);

  try {
    const data = await db
      .select({
        id: characters.id,
        name: characters.name,
        class: characters.class,
        race: characters.race,
        status: characters.status,
      })
      .from(characters)
      .where(eq(characters.userId, userId))
      .limit(limit)
      .offset(offset);

    return c.json(data);
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to get characters' }, 500);
  }
});
