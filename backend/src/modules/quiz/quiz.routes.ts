import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { characters, characterSheets, db } from '@shared/db';
import type { AuthVariables } from '@shared/middleware';
import { errorHook } from '@shared/validation';

import { quizData as quizQuestions } from './quiz.data';
import { generateStatsSchema } from './quiz.schemas';
import { calculateStats } from './quiz.stats';

export const quizRoutes = new Hono<{ Variables: AuthVariables }>();

// GET /quiz/questions — returns all quiz questions
quizRoutes.get('/questions', (c) => {
  return c.json({ questions: quizQuestions });
});

// POST /quiz/:characterId/generate — calculate stats from the results in the body
quizRoutes.post(
  '/:characterId/generate',
  zValidator('json', generateStatsSchema, errorHook),
  async (c) => {
    const userId = c.get('userId');
    const characterId = c.req.param('characterId');
    const { results } = c.req.valid('json');

    try {
      // The userId filter *is* the ownership check. Without it any logged-in
      // user could regenerate any character's scores and flip its status.
      const character = await db
        .select()
        .from(characters)
        .where(
          and(eq(characters.id, characterId), eq(characters.userId, userId))
        );

      if (character.length === 0) {
        return c.json({ error: 'Character not found' }, 404);
      }

      const { characterClass, race } = character[0];
      const stats = calculateStats(results, characterClass, race);

      // Scores are real columns on the sheet row now, so this spans two tables
      // and has to be atomic — a status flip without scores leaves an `active`
      // character the sheet renders as all-tens.
      await db.transaction(async (tx) => {
        await tx
          .update(characterSheets)
          .set({
            str: stats.str,
            dex: stats.dex,
            con: stats.con,
            intScore: stats.int,
            wis: stats.wis,
            cha: stats.cha,
          })
          .where(eq(characterSheets.characterId, characterId));

        await tx
          .update(characters)
          .set({ status: 'active' })
          .where(eq(characters.id, characterId));
      });

      return c.json({ stats });
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to generate stats' }, 500);
    }
  }
);
