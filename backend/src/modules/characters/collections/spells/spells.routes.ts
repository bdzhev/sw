import { zValidator } from '@hono/zod-validator';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { PG_ERROR, characterSpells, db, isPgError } from '@shared/db';
import { errorHook } from '@shared/validation';

import { requireOwnedCharacter } from '../collection.ownership';
import type { OwnedCharacterVariables } from '../collection.ownership';
import { selectCharacterSpell } from './spells.mapper';
import { createSpellSchema, updateSpellSchema } from './spells.schemas';

/**
 * The character's own spell list. Named `characterSpellsRoutes` rather than
 * `spellsRoutes` (which rules.md §2 would otherwise ask for) because the shared
 * reference library will own the top-level `/spells`, and two routers with the
 * same symbol in one import list is the mis-mount the rule exists to prevent.
 */
export const characterSpellsRoutes = new Hono<{
  Variables: OwnedCharacterVariables;
}>();

// One mount, every route below covered. Not repeated per handler on purpose.
characterSpellsRoutes.use('*', requireOwnedCharacter);

characterSpellsRoutes.post(
  '/',
  zValidator('json', createSpellSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const values = c.req.valid('json');

    try {
      const created = await db
        .insert(characterSpells)
        .values({ ...values, characterId })
        .returning();

      // Re-read through the join: `.returning()` alone answers with a shape the
      // list GET never produces, and the client appends this response straight
      // into its cache. See spells.mapper.ts.
      return c.json(await selectCharacterSpell(created[0].id), 201);
    } catch (err) {
      // Mirrors the table's reference-xor-custom CHECK. The schema catches this
      // first; this is the backstop for a body shape it cannot see.
      if (isPgError(err, PG_ERROR.CHECK_VIOLATION)) {
        return c.json(
          { error: 'Provide exactly one of spellId or customName' },
          400
        );
      }
      console.error(err);

      return c.json({ error: 'Failed to create spell' }, 500);
    }
  }
);

characterSpellsRoutes.patch(
  '/:rowId',
  zValidator('json', updateSpellSchema, errorHook),
  async (c) => {
    const characterId = c.get('characterId');
    const rowId = c.req.param('rowId');
    const patch = c.req.valid('json');

    try {
      // Scoped by characterId as well as the row id: owning *a* character must
      // not let you patch a row hanging off someone else's.
      const updated = await db
        .update(characterSpells)
        .set(patch)
        .where(
          and(
            eq(characterSpells.id, rowId),
            eq(characterSpells.characterId, characterId)
          )
        )
        .returning();

      if (updated.length === 0) {
        return c.json({ error: 'Spell not found' }, 404);
      }

      return c.json(await selectCharacterSpell(updated[0].id));
    } catch (err) {
      // Mirrors the table's reference-xor-custom CHECK. The schema catches this
      // first; this is the backstop for a body shape it cannot see.
      if (isPgError(err, PG_ERROR.CHECK_VIOLATION)) {
        return c.json(
          { error: 'Provide exactly one of spellId or customName' },
          400
        );
      }
      console.error(err);

      return c.json({ error: 'Failed to update spell' }, 500);
    }
  }
);

characterSpellsRoutes.delete('/:rowId', async (c) => {
  const characterId = c.get('characterId');
  const rowId = c.req.param('rowId');

  try {
    const deleted = await db
      .delete(characterSpells)
      .where(
        and(
          eq(characterSpells.id, rowId),
          eq(characterSpells.characterId, characterId)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return c.json({ error: 'Spell not found' }, 404);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error(err);

    return c.json({ error: 'Failed to delete spell' }, 500);
  }
});
