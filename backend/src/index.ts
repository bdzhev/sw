import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';

import { authMiddleware } from './middlewares/auth';
import { authRoutes } from './routes/auth';
import { characterRoute } from './routes/character';
import { characterRoutes } from './routes/characters';
import { quizRoutes } from './routes/quiz';
import { userRoutes } from './routes/users';

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
app.use('/users/me', authMiddleware);
app.route('/users', userRoutes);

app.use('/characters/*', authMiddleware);
app.route('/characters', characterRoutes);

app.use('/character/*', authMiddleware);
app.route('/character', characterRoute);

app.use('/quiz/*', authMiddleware);
app.route('/quiz', quizRoutes);

export default app;
