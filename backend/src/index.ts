import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { authMiddleware } from './middlewares/auth'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/users'
import { characterRoutes } from './routes/characters'
import { quizRoutes } from './routes/quiz'

const app = new Hono()

app.use('*', cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', authRoutes);
app.use('/users/me', authMiddleware);
app.route('/users', userRoutes);

app.use('/characters/*', authMiddleware);
app.route('/characters', characterRoutes);

app.use('/quiz/*', authMiddleware);
app.route('/quiz', quizRoutes);

export default app
