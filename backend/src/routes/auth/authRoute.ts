import { generateCodeVerifier, generateState, Google } from 'arctic';
import { and, eq, gt } from 'drizzle-orm';
import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { SignJWT } from 'jose';
import { db, sessions, users } from '../../db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const ACCESS_TOKEN_TTL = '7d';
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!,
);


async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
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
  await db.insert(sessions).values({ userId, refreshTokenHash: hash, expiresAt });
  return rawToken;
}

function setRefreshCookie(c: any, token: string) {
  setCookie(c, 'refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    maxAge: REFRESH_TOKEN_TTL_MS / 1000,
  });
}

async function findOrCreateUser(
  provider: string,
  providerId: string,
  name: string,
  email: string,
) {
  const existing = await db
    .select()
    .from(users)
    .where(and(eq(users.provider, provider), eq(users.providerId, providerId)));

  if (existing.length > 0) return existing[0];

  const created = await db
    .insert(users)
    .values({ provider, providerId, name, email })
    .returning();
  return created[0];
}

export const authRoutes = new Hono();

// ─── Google ───────────────────────────────────────────────────────────────────

authRoutes.get('/google', async (c) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ['openid', 'email', 'profile']);
  setCookie(c, 'oauth_state', state, { httpOnly: true, sameSite: 'Lax', maxAge: 600 });
  setCookie(c, 'code_verifier', codeVerifier, { httpOnly: true, sameSite: 'Lax', maxAge: 600 });
  return c.redirect(url.toString());
});

authRoutes.get('/google/callback', async (c) => {
  const { code, state } = c.req.query();
  const storedState = getCookie(c, 'oauth_state');
  const codeVerifier = getCookie(c, 'code_verifier');
  deleteCookie(c, 'oauth_state');
  deleteCookie(c, 'code_verifier');

  if (!state || state !== storedState || !codeVerifier) {
    return c.json({ error: 'Invalid state' }, 400);
  }

  let tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return c.json({ error: 'Failed to exchange code' }, 400);
  }

  const profileRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${tokens.accessToken()}` },
  });
  const profile = await profileRes.json() as { sub: string; name: string; email: string };

  const user = await findOrCreateUser('google', profile.sub, profile.name, profile.email);

  const refreshToken = await createSession(user.id);
  const accessToken = await signAccessToken(user.id);

  setRefreshCookie(c, refreshToken);
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:8080';
  return c.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
});

// ─── Refresh ──────────────────────────────────────────────────────────────────

authRoutes.post('/refresh', async (c) => {
  const rawToken = getCookie(c, 'refresh_token');
  if (!rawToken) return c.json({ error: 'Unauthorized' }, 401);

  const hash = await hashToken(rawToken);
  const now = new Date();

  const result = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.refreshTokenHash, hash), gt(sessions.expiresAt, now)));

  if (result.length === 0) {
    return c.json({ error: 'Session expired or invalid' }, 401);
  }

  const accessToken = await signAccessToken(result[0].userId);
  return c.json({ accessToken });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

authRoutes.get('/logout', async (c) => {
  const rawToken = getCookie(c, 'refresh_token');
  if (rawToken) {
    const hash = await hashToken(rawToken);
    await db.delete(sessions).where(eq(sessions.refreshTokenHash, hash));
  }
  deleteCookie(c, 'refresh_token', { path: '/' });
  return c.json({ success: true });
});
