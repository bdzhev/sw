import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { attacks, db } from '@shared/db';
import { errorHook } from '@shared/validation';

import { requireOwnedCharacter } from '../collection.ownership';
import type { OwnedCharacterVariables } from '../collection.ownership';
import { createAttackSchema, updateAttackSchema } from './attacks.schemas';

export const attacksRoutes = new Hono<{
  Variables: OwnedCharacterVariables;
}>();

// One mount, every route below covered. Not repeated per handler on purpose.
attacksRoutes.use('*', requireOwnedCharacter);

attacksRoutes.post(
  '/',
  zValidator('json', createAttackSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const values = c.req.valid('json');

    try {
      const created = await db
        .insert(attacks)
        .values({ ...values, characterId })
        .returning();

      return c.json(created[0], 201);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to create attack' }, 500);
    }
  }
);

attacksRoutes.patch(
  '/:rowId',
  zValidator('json', updateAttackSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const rowId = c.req.param('rowId');
    const patch = c.req.valid('json');

    try {
      // Scoped by characterId as well as the row id: owning *a* character must
      // not let you patch a row hanging off someone else's.
      const updated = await db
        .update(attacks)
        .set(patch)
        .where(and(eq(attacks.id, rowId), eq(attacks.characterId, characterId)))
        .returning();

      if (updated.length === 0) {
        return c.json({ error: 'Attack not found' }, 404);
      }

      return c.json(updated[0]);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to update attack' }, 500);
    }
  }
);

attacksRoutes.delete('/:rowId', async (c) => {
  const characterId = c.get('characterId');
  const rowId = c.req.param('rowId');

  try {
    const deleted = await db
      .delete(attacks)
      .where(and(eq(attacks.id, rowId), eq(attacks.characterId, characterId)))
      .returning();

    if (deleted.length === 0) {
      return c.json({ error: 'Attack not found' }, 404);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to delete attack' }, 500);
  }
});
