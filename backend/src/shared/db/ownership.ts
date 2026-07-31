import { and, eq } from 'drizzle-orm';

import type { db } from './db';
import { characters } from './schema';

/** `db` or a transaction handle — both satisfy the `select` used below. */
type DbOrTx = Pick<typeof db, 'select'>;

/**
 * The one ownership check. Every character-scoped route goes through it rather
 * than hand-rolling the filter, and sub-entity routes (keyed on characterId)
 * use it to verify the *parent's* userId before reading or writing — none of
 * the sub-tables carry a user_id of their own.
 *
 * Takes the client so it can run inside a transaction.
 */
export const assertOwnedCharacter = async (
  client: DbOrTx,
  characterId: string,
  userId: number
): Promise<boolean> => {
  const rows = await client
    .select({ id: characters.id })
    .from(characters)
    .where(and(eq(characters.id, characterId), eq(characters.userId, userId)));

  return rows.length > 0;
};
