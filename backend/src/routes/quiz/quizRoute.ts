import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { characters, db } from '../../db';
import { calculateStats } from './calculateStats';
import { quizData as quizQuestions } from './quizData';

export const quizRoutes = new Hono();

// GET /quiz/questions — returns all quiz questions
quizRoutes.get('/questions', (c) => {
  return c.json({ questions: quizQuestions });
});

// POST /quiz/:characterId/generate — calculate stats from the results in the body
quizRoutes.post('/:characterId/generate', async (c) => {
  const characterId = c.req.param('characterId');
  const { results } = await c.req.json();

  if (!results || typeof results !== 'object') {
    return c.json({ error: 'results is required' }, 400);
  }

  try {
    const character = await db
      .select()
      .from(characters)
      .where(eq(characters.id, characterId));

    if (character.length === 0) {
      return c.json({ error: 'Character not found' }, 404);
    }

    const { class: charClass, race } = character[0];
    const stats = calculateStats(results, charClass, race);

    await db
      .update(characters)
      .set({ stats, status: 'active' })
      .where(eq(characters.id, characterId));

    return c.json({ stats });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to generate stats' }, 500);
  }
});
