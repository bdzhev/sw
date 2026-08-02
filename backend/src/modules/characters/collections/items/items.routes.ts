import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { db, inventoryItems } from '@shared/db';
import { errorHook } from '@shared/validation';

import { requireOwnedCharacter } from '../collection.ownership';
import type { OwnedCharacterVariables } from '../collection.ownership';
import { createItemSchema, updateItemSchema } from './items.schemas';

export const itemsRoutes = new Hono<{
  Variables: OwnedCharacterVariables;
}>();

// One mount, every route below covered. Not repeated per handler on purpose.
itemsRoutes.use('*', requireOwnedCharacter);

itemsRoutes.post(
  '/',
  zValidator('json', createItemSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const values = c.req.valid('json');

    try {
      const created = await db
        .insert(inventoryItems)
        .values({ ...values, characterId })
        .returning();

      return c.json(created[0], 201);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to create item' }, 500);
    }
  }
);

itemsRoutes.patch(
  '/:rowId',
  zValidator('json', updateItemSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const rowId = c.req.param('rowId');
    const patch = c.req.valid('json');

    try {
      // Scoped by characterId as well as the row id: owning *a* character must
      // not let you patch a row hanging off someone else's.
      const updated = await db
        .update(inventoryItems)
        .set(patch)
        .where(
          and(
            eq(inventoryItems.id, rowId),
            eq(inventoryItems.characterId, characterId)
          )
        )
        .returning();

      if (updated.length === 0) {
        return c.json({ error: 'Item not found' }, 404);
      }

      return c.json(updated[0]);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to update item' }, 500);
    }
  }
);

itemsRoutes.delete('/:rowId', async (c) => {
  const characterId = c.get('characterId');
  const rowId = c.req.param('rowId');

  try {
    const deleted = await db
      .delete(inventoryItems)
      .where(
        and(
          eq(inventoryItems.id, rowId),
          eq(inventoryItems.characterId, characterId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return c.json({ error: 'Item not found' }, 404);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to delete item' }, 500);
  }
});
