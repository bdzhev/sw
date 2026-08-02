import { authRoutes } from '@modules/auth';
import { characterRoutes, charactersRoutes } from '@modules/characters';
import { quizRoutes } from '@modules/quiz';
import { userRoutes } from '@modules/users';
import { authMiddleware } from '@shared/middleware/auth';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
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

export default app;
