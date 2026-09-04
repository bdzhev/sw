import { zValidator } from '@hono/zod-validator';
import { and, eq, gt } from 'drizzle-orm';
import { Hono, type Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { SignJWT } from 'jose';

import { db, isPgError, PG_ERROR, sessions, users } from '@shared/db';
import { errorHook } from '@shared/validation';

import { loginSchema, registerSchema } from './auth.schemas';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const ACCESS_TOKEN_TTL = '7d';
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(token)
  );

  return Array.from(new Uint8Array(buf))
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join('');
}

async function signAccessToken(userId: number): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(JWT_SECRET);
}

async function createSession(userId: number): Promise<string> {
  const rawToken = crypto.randomUUID() + crypto.randomUUID();
  const hash = await hashToken(rawToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await db
    .insert(sessions)
    .values({ userId, refreshTokenHash: hash, expiresAt });

  return rawToken;
}

function setRefreshCookie(c: Context, token: string): void {
  setCookie(c, 'refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: REFRESH_TOKEN_TTL_MS / 1000,
  });
}

function setAccessCookie(c: Context, token: string): void {
  setCookie(c, 'access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export const authRoutes = new Hono();

// ─── Register ─────────────────────────────────────────────────────────────────

authRoutes.post(
  '/register',
  zValidator('json', registerSchema, errorHook),
  async (c) => {
    const { username, password } = c.req.valid('json');

    // Argon2id via Bun's runtime — no dependency, and the salt lives inside the
    // returned string, so there is no second column to manage.
    const passwordHash = await Bun.password.hash(password);

    try {
      const created = await db
        .insert(users)
        .values({ username, password: passwordHash })
        .returning();
      const user = created[0];

      const refreshToken = await createSession(user.id);
      const accessToken = await signAccessToken(user.id);

      setRefreshCookie(c, refreshToken);
      setAccessCookie(c, accessToken);

      return c.json({ id: user.id, username: user.username }, 201);
    } catch (err) {
      // The unique index is what actually decides this, not a preceding SELECT:
      // check-then-insert leaves a window where two simultaneous registrations
      // both pass the check and the second one 500s on the constraint.
      if (isPgError(err, PG_ERROR.UNIQUE_VIOLATION)) {
        return c.json({ error: 'Username already taken' }, 409);
      }
      console.error(err);

      return c.json({ error: 'Failed to register' }, 500);
    }
  }
);

// ─── Login ────────────────────────────────────────────────────────────────────

authRoutes.post(
  '/login',
  zValidator('json', loginSchema, errorHook),
  async (c) => {
    const { username, password } = c.req.valid('json');

    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    // One message for both "no such user" and "wrong password", so a caller
    // cannot probe which usernames exist. (Register's 409 discloses that on
    // purpose — it has to, to tell you the name is taken.)
    if (result.length === 0) {
      return c.json({ error: 'Invalid username or password' }, 401);
    }

    const user = result[0];

    if (!(await Bun.password.verify(password, user.password))) {
      return c.json({ error: 'Invalid username or password' }, 401);
    }

    const refreshToken = await createSession(user.id);
    const accessToken = await signAccessToken(user.id);

    setRefreshCookie(c, refreshToken);
    setAccessCookie(c, accessToken);

    return c.json({ id: user.id, username: user.username });
  }
);

// ─── Refresh ──────────────────────────────────────────────────────────────────

authRoutes.post('/refresh', async (c) => {
  const rawToken = getCookie(c, 'refresh_token');

  if (!rawToken) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const hash = await hashToken(rawToken);
  const now = new Date();

  const result = await db
    .select()
    .from(sessions)
    .where(
      and(eq(sessions.refreshTokenHash, hash), gt(sessions.expiresAt, now))
    );

  if (result.length === 0) {
    return c.json({ error: 'Session expired or invalid' }, 401);
  }

  const accessToken = await signAccessToken(result[0].userId);
  setAccessCookie(c, accessToken);

  return c.json({ success: true });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

authRoutes.get('/logout', async (c) => {
  const rawToken = getCookie(c, 'refresh_token');

  if (rawToken) {
    const hash = await hashToken(rawToken);
    await db.delete(sessions).where(eq(sessions.refreshTokenHash, hash));
  }

  deleteCookie(c, 'refresh_token', { path: '/' });
  deleteCookie(c, 'access_token', { path: '/' });

  return c.json({ success: true });
});
