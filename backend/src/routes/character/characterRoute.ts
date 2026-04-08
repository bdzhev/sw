import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { characters, db, quizData } from '../../db';
import type { AuthVariables } from '../../middlewares/auth';

export const characterRoute = new Hono<{ Variables: AuthVariables }>();

characterRoute.get('/:id', async (c) => {
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

characterRoute.patch('/:id', async (c) => {
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

    return c.json(result[0]);
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to update character' }, 500);
  }
});

characterRoute.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  try {
    await db.delete(quizData).where(eq(quizData.characterId, id));

    const result = await db
      .delete(characters)
      .where(and(eq(characters.id, id), eq(characters.userId, userId)))
      .returning();

    if (result.length === 0) {
      return c.json({ error: 'Character not found' }, 404);
    }

    return c.json({ success: true }, 200);
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to delete character' }, 500);
  }
});
