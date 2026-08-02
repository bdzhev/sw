import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { classResources, db } from '@shared/db';
import { errorHook } from '@shared/validation';

import { requireOwnedCharacter } from '../collection.ownership';
import type { OwnedCharacterVariables } from '../collection.ownership';
import {
  createResourceSchema,
  updateResourceSchema,
} from './resources.schemas';

export const resourcesRoutes = new Hono<{
  Variables: OwnedCharacterVariables;
}>();

// One mount, every route below covered. Not repeated per handler on purpose.
resourcesRoutes.use('*', requireOwnedCharacter);

resourcesRoutes.post(
  '/',
  zValidator('json', createResourceSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const values = c.req.valid('json');

    try {
      const created = await db
        .insert(classResources)
        .values({ ...values, characterId })
        .returning();

      return c.json(created[0], 201);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to create resource' }, 500);
    }
  }
);

resourcesRoutes.patch(
  '/:rowId',
  zValidator('json', updateResourceSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const rowId = c.req.param('rowId');
    const patch = c.req.valid('json');

    try {
      // Scoped by characterId as well as the row id: owning *a* character must
      // not let you patch a row hanging off someone else's.
      const updated = await db
        .update(classResources)
        .set(patch)
        .where(
          and(
            eq(classResources.id, rowId),
            eq(classResources.characterId, characterId)
          )
        )
        .returning();

      if (updated.length === 0) {
        return c.json({ error: 'Resource not found' }, 404);
      }

      return c.json(updated[0]);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to update resource' }, 500);
    }
  }
);

resourcesRoutes.delete('/:rowId', async (c) => {
  const characterId = c.get('characterId');
  const rowId = c.req.param('rowId');

  try {
    const deleted = await db
      .delete(classResources)
      .where(
        and(
          eq(classResources.id, rowId),
          eq(classResources.characterId, characterId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return c.json({ error: 'Resource not found' }, 404);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to delete resource' }, 500);
  }
});
