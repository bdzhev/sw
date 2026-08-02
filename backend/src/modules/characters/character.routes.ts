import { zValidator } from '@hono/zod-validator';
import { and, asc, eq, sql } from 'drizzle-orm';
import { Hono } from 'hono';

import {
  assertOwnedCharacter,
  attacks,
  characters,
  characterSheets,
  characterSpells,
  classResources,
  db,
  inventoryItems,
  spells,
  traits,
} from '@shared/db';
import type { AuthVariables } from '@shared/middleware';
import { errorHook } from '@shared/validation';

import { updateCharacterSchema, updateSheetSchema } from './character.schemas';
import {
  attacksRoutes,
  characterSpellsRoutes,
  itemsRoutes,
  resourcesRoutes,
  traitsRoutes,
} from './collections';

export const characterRoutes = new Hono<{ Variables: AuthVariables }>();

characterRoutes.get('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  try {
    const character = await db
      .select()
      .from(characters)
      .where(and(eq(characters.id, id), eq(characters.userId, userId)));

    if (character.length === 0) {
      return c.json({ error: 'Character not found' }, 404);
    }

    // The 1:1 sheet row is born with the character, so this needs no left join
    // and no missing-row branch. Sub-collections carry the player's own
    // sort_order because Postgres guarantees no row order on its own.
    const [sheet, attackRows, traitRows, resourceRows, itemRows, spellRows] =
      await Promise.all([
        db
          .select()
          .from(characterSheets)
          .where(eq(characterSheets.characterId, id)),
        db
          .select()
          .from(attacks)
          .where(eq(attacks.characterId, id))
          .orderBy(asc(attacks.sortOrder), asc(attacks.createdAt)),
        db
          .select()
          .from(traits)
          .where(eq(traits.characterId, id))
          .orderBy(asc(traits.sortOrder), asc(traits.createdAt)),
        db
          .select()
          .from(classResources)
          .where(eq(classResources.characterId, id))
          .orderBy(
            asc(classResources.sortOrder),
            asc(classResources.createdAt)
          ),
        db
          .select()
          .from(inventoryItems)
          .where(eq(inventoryItems.characterId, id))
          .orderBy(
            asc(inventoryItems.sortOrder),
            asc(inventoryItems.createdAt)
          ),
        db
          .select({
            id: characterSpells.id,
            spellId: characterSpells.spellId,
            customName: characterSpells.customName,
            customDescription: characterSpells.customDescription,
            sortOrder: characterSpells.sortOrder,
            createdAt: characterSpells.createdAt,
            spell: spells,
          })
          .from(characterSpells)
          .leftJoin(spells, eq(characterSpells.spellId, spells.id))
          .where(eq(characterSpells.characterId, id))
          .orderBy(
            asc(characterSpells.sortOrder),
            asc(characterSpells.createdAt)
          ),
      ]);

    return c.json({
      character: character[0],
      sheet: sheet[0],
      attacks: attackRows,
      traits: traitRows,
      classResources: resourceRows,
      inventoryItems: itemRows,
      // `spell_id IS NULL` is the custom marker, so `isCustom` is computed here
      // rather than stored — a stored boolean could drift away from the FK.
      spells: spellRows.map((row) => {
        return { ...row, isCustom: row.spellId === null };
      }),
    });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to get character' }, 500);
  }
});

characterRoutes.patch(
  '/:id',
  zValidator('json', updateCharacterSchema, errorHook),
  async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const patch = c.req.valid('json');

    try {
      const result = await db
        .update(characters)
        .set(patch)
        .where(and(eq(characters.id, id), eq(characters.userId, userId)))
        .returning();

      if (result.length === 0) {
        return c.json({ error: 'Character not found' }, 404);
      }

      return c.json(result[0]);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to update character' }, 500);
    }
  }
);

/** The autosave controller's `character` target. Absolute values, never deltas. */
characterRoutes.patch(
  '/:id/sheet',
  zValidator('json', updateSheetSchema, errorHook),
  async (c) => {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const patch = c.req.valid('json');

    try {
      // character_sheets has no user_id of its own, so ownership is the parent's.
      if (!(await assertOwnedCharacter(db, id, userId))) {
        return c.json({ error: 'Character not found' }, 404);
      }

      const result = await db
        .update(characterSheets)
        .set({
          ...patch,
          lastWriteSeq: sql`${characterSheets.lastWriteSeq} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(characterSheets.characterId, id))
        .returning();

      return c.json(result[0]);
    } catch (err) {
      console.error(err);

      return c.json({ error: 'Failed to update sheet' }, 500);
    }
  }
);

characterRoutes.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  try {
    const result = await db
      .delete(characters)
      .where(and(eq(characters.id, id), eq(characters.userId, userId)))
      .returning();

    if (result.length === 0) {
      return c.json({ error: 'Character not found' }, 404);
    }

    return c.json({ success: true }, 200);
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to delete character' }, 500);
  }
});

// Sub-collections mount here rather than in app/server.ts: they are
// sub-resources of one character and share its ownership check. Each sub-app
// applies `requireOwnedCharacter` itself, and Hono merges the parent `:id` into
// the child, so handlers read the verified id off the context.
characterRoutes.route('/:id/attacks', attacksRoutes);
characterRoutes.route('/:id/traits', traitsRoutes);
characterRoutes.route('/:id/resources', resourcesRoutes);
characterRoutes.route('/:id/items', itemsRoutes);
characterRoutes.route('/:id/spells', characterSpellsRoutes);
