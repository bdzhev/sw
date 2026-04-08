import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { db, users } from '../../db';
import type { AuthVariables } from '../../middlewares/auth';

export const userRoutes = new Hono<{ Variables: AuthVariables }>();

userRoutes.get('/me', async (c) => {
  const userId = c.get('userId');
  try {
    const result = await db.select().from(users).where(eq(users.id, userId));
    if (result.length === 0) return c.json({ error: 'User not found' }, 404);
    const { id, username } = result[0];
    return c.json({ id, username });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

userRoutes.get('/', async (c) => {
  try {
    const data = await db.select().from(users);
    return c.json(data);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to get users' }, 500);
  }
});
