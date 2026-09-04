import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';

import { authMiddleware } from '@shared/middleware';

import { authRoutes } from '@modules/auth';
import { characterRoutes, charactersRoutes } from '@modules/characters';
import { quizRoutes } from '@modules/quiz';
import { spellsRoutes } from '@modules/spells';
import { userRoutes } from '@modules/users';

const app = new Hono();

/**
 * Loopback and the three private IPv4 ranges, on any port.
 *
 * Players at the table open the sheet by LAN address, so their `Origin` is
 * never `localhost` — and `credentials: true` forbids the `*` wildcard, so each
 * origin has to be reflected back individually. The port is left open because
 * the frontend answers on 5173 under `make dev` and 8080 under `make prod`.
 *
 * This is deliberately permissive: the app is designed to be run on a laptop
 * for the people in the room. `ALLOWED_ORIGINS` turns it off.
 */
const PRIVATE_ORIGIN =
  /^https?:\/\/(?:localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(?::\d+)?$/;

/**
 * `ALLOWED_ORIGINS` (comma-separated) pins CORS for a real deployment. Note it
 * is *not* `FRONTEND_URL`: that one is set to `http://localhost:5173` in every
 * checkout, and treating it as the allow-list locked every phone out.
 */
const allowList = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((entry) => {
    return entry.trim();
  })
  .filter(Boolean);

const resolveOrigin = (origin: string): string | null => {
  if (allowList.length > 0) {
    return allowList.includes(origin) ? origin : null;
  }

  return PRIVATE_ORIGIN.test(origin) ? origin : null;
};

app.use(
  '*',
  cors({
    origin: resolveOrigin,
    credentials: true,
  })
);

app.use(
  '/assets/*',
  serveStatic({
    root: './public',
    onFound: (_path, c) => {
      c.header('Cache-Control', 'public, max-age=31536000, immutable');
    },
  })
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/auth', authRoutes);
// Wildcard, not the exact path `/users/me`: mounting on one literal path leaves
// every future /users route unauthenticated by default, which is how `GET /users`
// came to be reachable without a session.
app.use('/users/*', authMiddleware);
app.route('/users', userRoutes);

// The plural/singular split is deliberate, not a typo: /characters is the
// paginated collection, /character/:id is one full character. Router symbol
// always matches its path segment.
app.use('/characters/*', authMiddleware);
app.route('/characters', charactersRoutes);

app.use('/character/*', authMiddleware);
app.route('/character', characterRoutes);

app.use('/quiz/*', authMiddleware);
app.route('/quiz', quizRoutes);

// Only /spells/search is exposed. A bare `GET /spells` would sit outside the
// wildcard above and answer without a session.
app.use('/spells/*', authMiddleware);
app.route('/spells', spellsRoutes);

export default app;
