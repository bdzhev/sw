import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { db, inventoryItems } from '@shared/db';
import { errorHook } from '@shared/validation';

import { requireOwnedCharacter } from '../collection.ownership';
import type { OwnedCharacterVariables } from '../collection.ownership';
import { createItemSchema, updateItemSchema } from './items.schemas';

/**
 * `GET /character/:id` returns every sub-collection in full, unpaginated, so an
 * unbounded inventory grows the one request the whole sheet blocks on. 200 rows
 * keeps that response openable on a phone and is two orders of magnitude above
 * any real sheet.
 */
export const MAX_ITEMS_PER_CHARACTER = 200;

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
      // Count-then-insert is not atomic: two simultaneous creates can both pass
      // and land on 201. Benign here (the UI disables the trigger at the cap);
      // the atomic form is one INSERT ... SELECT ... WHERE (SELECT count(*)) < N.
      const total = await db.$count(
        inventoryItems,
        eq(inventoryItems.characterId, characterId)
      );

      if (total >= MAX_ITEMS_PER_CHARACTER) {
        return c.json(
          { error: `Item limit reached (${MAX_ITEMS_PER_CHARACTER})` },
          409
        );
      }

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
