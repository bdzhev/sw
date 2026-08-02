import { zValidator } from '@hono/zod-validator';
import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import {
  characters,
  characterSheets,
  db,
  isPgError,
  PG_ERROR,
} from '@shared/db';
import type { AuthVariables } from '@shared/middleware';
import { errorHook } from '@shared/validation';

import { speedForRace } from './character.defaults';
import {
  characterListQuerySchema,
  createCharacterSchema,
} from './character.schemas';

export { PAGE_SIZE } from './character.schemas';

export const charactersRoutes = new Hono<{ Variables: AuthVariables }>();

export const MAX_CHARACTERS_PER_USER = 50;

charactersRoutes.post(
  '/',
  zValidator('json', createCharacterSchema, errorHook),
  async (c) => {
    const userId = c.get('userId');
    const { name, characterClass, race } = c.req.valid('json');

    try {
      // Count-then-insert is not atomic: two simultaneous creates can both pass
      // and land on 51. Benign here (the UI disables the trigger at the cap);
      // the atomic form is one INSERT ... SELECT ... WHERE (SELECT count(*)) < N.
      const total = await db.$count(characters, eq(characters.userId, userId));

      if (total >= MAX_CHARACTERS_PER_USER) {
        return c.json(
          { error: `Character limit reached (${MAX_CHARACTERS_PER_USER})` },
          409
        );
      }

      // The 1:1 sheet row is born with the character, in one transaction, so no
      // read needs a left join and no GET has to handle a missing row.
      const character = await db.transaction(async (tx) => {
        const inserted = await tx
          .insert(characters)
          .values({
            userId,
            name,
            characterClass,
            race,
            status: 'pending',
          })
          .returning();

        // Only race-derived defaults exist yet — the quiz has not run, so there
        // are no ability scores and hp_max/ac cannot be computed. Setup fills
        // those; the rest of the row takes its column defaults (level 1 etc).
        await tx.insert(characterSheets).values({
          characterId: inserted[0].id,
          speed: speedForRace(race),
        });

        return inserted[0];
      });

      return c.json(character, 201);
    } catch (err) {
      if (isPgError(err, PG_ERROR.FOREIGN_KEY_VIOLATION)) {
        return c.json({ error: 'User not found' }, 404);
      }
      // The schema rejects a bad enum value before it can get here, so this is a
      // backstop for a route that forgets one — not the main path. Left in
      // because without it the failure mode is a 500.
      if (isPgError(err, PG_ERROR.INVALID_TEXT_REPRESENTATION)) {
        return c.json({ error: 'Invalid characterClass or race' }, 400);
      }
      console.error(err);

      return c.json({ error: 'Failed to create character' }, 500);
    }
  }
);

charactersRoutes.get(
  '/',
  zValidator('query', characterListQuerySchema, errorHook),
  async (c) => {
    const userId = c.get('userId');
    const { offset, limit } = c.req.valid('query');

    try {
      const ownedByUser = eq(characters.userId, userId);

      const [items, total] = await Promise.all([
        db
          .select({
            id: characters.id,
            name: characters.name,
            characterClass: characters.characterClass,
            race: characters.race,
            status: characters.status,
          })
          .from(characters)
          .where(ownedByUser)
          // Deterministic order is required, not cosmetic: LIMIT/OFFSET over an
          // unordered result lets a row repeat across pages or never appear at
          // all. `id` breaks ties for rows sharing a created_at.
          .orderBy(desc(characters.createdAt), desc(characters.id))
          .limit(limit)
          .offset(offset),
        db.$count(characters, ownedByUser),
      ]);

      return c.json({ items, total });
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to get characters' }, 500);
    }
  }
);
