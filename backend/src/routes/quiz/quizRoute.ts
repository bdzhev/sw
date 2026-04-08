import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { characters, db, quizData } from '../../db';
import { calculateStats } from './calculateStats';
import { quizData as quizQuestions } from './quizData';

export const quizRoutes = new Hono();

// GET /quiz/questions — returns all quiz questions
quizRoutes.get('/questions', (c) => {
  return c.json({ questions: quizQuestions });
});

// GET /quiz/:characterId
quizRoutes.get('/:characterId', async (c) => {
  const characterId = c.req.param('characterId');

  try {
    const result = await db.select().from(quizData).where(eq(quizData.characterId, characterId));

    if (result.length === 0) {
      return c.json({ results: {} });
    }

    return c.json(result[0]);
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to get quiz data' }, 500);
  }
});

// PUT /quiz/:characterId — upsert (create or replace)
quizRoutes.put('/:characterId', async (c) => {
  const characterId = c.req.param('characterId');
  const { results } = await c.req.json();

  if (!results) {
    return c.json({ error: 'results is required' }, 400);
  }

  try {
    const result = await db
      .insert(quizData)
      .values({ characterId, results })
      .onConflictDoUpdate({
        target: quizData.characterId,
        set: { results },
      })
      .returning();

    await db.update(characters)
      .set({ status: 'draft' })
      .where(and(eq(characters.id, characterId), eq(characters.status, 'pending')));

    return c.json(result[0]);
  } catch (err: any) {
    if (err?.code === '23503') {
      return c.json({ error: 'Character not found' }, 404);
    }
    console.error(err);

    return c.json({ error: 'Failed to upsert quiz data' }, 500);
  }
});

// PATCH /quiz/:characterId — partial update
quizRoutes.patch('/:characterId', async (c) => {
  const characterId = c.req.param('characterId');
  const { results } = await c.req.json();

  if (results === undefined) {
    return c.json({ error: 'results is required' }, 400);
  }

  const updates: Record<string, unknown> = { results };

  try {
    const result = await db
      .update(quizData)
      .set(updates)
      .where(eq(quizData.characterId, characterId))
      .returning();

    if (result.length === 0) {
      return c.json({ error: 'Quiz data not found' }, 404);
    }

    return c.json(result[0]);
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to update quiz data' }, 500);
  }
});

// POST /quiz/:characterId/generate — fetch quiz results from DB and calculate stats
quizRoutes.post('/:characterId/generate', async (c) => {
  const characterId = c.req.param('characterId');

  try {
    const [character, quiz] = await Promise.all([
      db.select().from(characters).where(eq(characters.id, characterId)),
      db.select().from(quizData).where(eq(quizData.characterId, characterId)),
    ]);

    if (character.length === 0) {
      return c.json({ error: 'Character not found' }, 404);
    }

    if (quiz.length === 0) {
      return c.json({ error: 'Quiz data not found' }, 404);
    }

    const { class: charClass, race } = character[0];
    const stats = calculateStats(quiz[0].results as any, charClass, race);

    await db.update(characters).set({ stats, status: 'active' }).where(eq(characters.id, characterId));
    await db.delete(quizData).where(eq(quizData.characterId, characterId));

    return c.json({ stats });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to generate stats' }, 500);
  }
});
