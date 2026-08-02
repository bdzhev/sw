import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { db, traits } from '@shared/db';
import { errorHook } from '@shared/validation';

import { requireOwnedCharacter } from '../collection.ownership';
import type { OwnedCharacterVariables } from '../collection.ownership';
import { createTraitSchema, updateTraitSchema } from './traits.schemas';

export const traitsRoutes = new Hono<{
  Variables: OwnedCharacterVariables;
}>();

// One mount, every route below covered. Not repeated per handler on purpose.
traitsRoutes.use('*', requireOwnedCharacter);

traitsRoutes.post(
  '/',
  zValidator('json', createTraitSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const values = c.req.valid('json');

    try {
      const created = await db
        .insert(traits)
        .values({ ...values, characterId })
        .returning();

      return c.json(created[0], 201);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to create trait' }, 500);
    }
  }
);

traitsRoutes.patch(
  '/:rowId',
  zValidator('json', updateTraitSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const rowId = c.req.param('rowId');
    const patch = c.req.valid('json');

    try {
      // Scoped by characterId as well as the row id: owning *a* character must
      // not let you patch a row hanging off someone else's.
      const updated = await db
        .update(traits)
        .set(patch)
        .where(and(eq(traits.id, rowId), eq(traits.characterId, characterId)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: 'Trait not found' }, 404);
      }

      return c.json(updated[0]);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to update trait' }, 500);
    }
  }
);

traitsRoutes.delete('/:rowId', async (c) => {
  const characterId = c.get('characterId');
  const rowId = c.req.param('rowId');

  try {
    const deleted = await db
      .delete(traits)
      .where(and(eq(traits.id, rowId), eq(traits.characterId, characterId)))
      .returning();

    if (deleted.length === 0) {
      return c.json({ error: 'Trait not found' }, 404);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to delete trait' }, 500);
  }
});
