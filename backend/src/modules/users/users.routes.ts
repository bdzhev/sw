import { db, users } from '@shared/db';
import type { AuthVariables } from '@shared/middleware/auth';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

export const userRoutes = new Hono<{ Variables: AuthVariables }>();

// There is deliberately no `GET /` here. It used to return every user row —
// `select()`, so including the password column — and it was mounted outside the
// auth middleware, which protected only the exact path `/users/me`. Nothing ever
// consumed it: the frontend calls `/users/me` alone. This app has no admin
// surface and no user directory, so the endpoint has no reason to come back.

userRoutes.get('/me', async (c) => {
  const userId = c.get('userId');

  try {
    // Projected, not `select()`: the password hash has no business leaving the
    // database, let alone reaching a handler that then hand-picks two fields.
    const result = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(eq(users.id, userId));

    if (result.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(result[0]);
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to get user' }, 500);
  }
});
