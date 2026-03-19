import { createMiddleware } from 'hono/factory';
import { jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export type AuthVariables = {
  userId: number;
};

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET) as { payload: JWTPayload & { userId: number } };
    c.set('userId', payload.userId);
    await next();
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});
