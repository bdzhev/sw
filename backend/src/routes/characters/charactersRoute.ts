import { and, eq } from 'drizzle-orm';
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
    const result = await db.insert(characters).values({
      userId,
      name,
      class: characterClass,
      race,
      status: 'draft',
      stats: null,
    }).returning();

    return c.json({ character: result[0] }, 201);
  } catch (err: any) {
    if (err?.code === '23503') {
      return c.json({ error: 'User not found' }, 404);
    }
    console.error(err);
    return c.json({ error: 'Failed to create character' }, 500);
  }
});

characterRoutes.get('/', async (c) => {
  const userId = c.get('userId');

  try {
    const data = await db.select().from(characters).where(eq(characters.userId, userId));
    return c.json(data);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get characters' }, 500);
  }
});

characterRoutes.get('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  try {
    const result = await db
      .select()
      .from(characters)
      .where(and(eq(characters.id, id), eq(characters.userId, userId)));

    if (result.length === 0) {
      return c.json({ error: 'Character not found' }, 404);
    }

    return c.json(result[0]);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get character' }, 500);
  }
});

characterRoutes.patch('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  const { name } = await c.req.json();

  if (!name) {
    return c.json({ error: 'name is required' }, 400);
  }

  try {
    const result = await db
      .update(characters)
      .set({ name })
      .where(and(eq(characters.id, id), eq(characters.userId, userId)))
      .returning();

    if (result.length === 0) {
      return c.json({ error: 'Character not found' }, 404);
    }

    return c.json({ character: result[0] });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update character' }, 500);
  }
});

characterRoutes.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  try {
    const result = await db
      .delete(characters)
      .where(and(eq(characters.id, id), eq(characters.userId, userId)))
      .returning();

    if (result.length === 0) {
      return c.json({ error: 'Character not found' }, 404);
    }

    return c.json({ character: result[0] });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete character' }, 500);
  }
});
