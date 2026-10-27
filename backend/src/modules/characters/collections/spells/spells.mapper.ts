import { asc, eq } from 'drizzle-orm';

import { characterSpells, db, spells } from '@shared/db';

/**
 * One shape for a character's spell, wherever it comes from.
 *
 * The list GET joins the reference table and computes `isCustom`; the create and
 * update handlers used to answer with the bare `.returning()` row instead, which
 * has neither. The client appends a mutation response straight into its cached
 * detail, so a freshly added spell arrived with no name at all — and it is not a
 * mismatch the type system can catch across an HTTP boundary. Both sides go
 * through here now.
 */
const spellSelection = {
  id: characterSpells.id,
  spellId: characterSpells.spellId,
  customName: characterSpells.customName,
  customDescription: characterSpells.customDescription,
  customLevel: characterSpells.customLevel,
  sortOrder: characterSpells.sortOrder,
  createdAt: characterSpells.createdAt,
  spell: spells,
};

export interface CharacterSpellRow {
  id: string;
  spellId: string | null;
  customName: string | null;
  customDescription: string | null;
  customLevel: number | null;
  sortOrder: number;
  createdAt: Date;
  spell: typeof spells.$inferSelect | null;
}

export type CharacterSpellResponse = CharacterSpellRow & { isCustom: boolean };

/**
 * `spell_id IS NULL` is the custom marker, so `isCustom` is computed rather than
 * stored — a stored boolean could drift away from the FK.
 */
export const toCharacterSpell = (
  row: CharacterSpellRow
): CharacterSpellResponse => {
  return { ...row, isCustom: row.spellId === null };
};

/** The joined rows for one character, in the player's own order. */
export const selectCharacterSpells = (
  characterId: string
): Promise<CharacterSpellRow[]> => {
  return db
    .select(spellSelection)
    .from(characterSpells)
    .leftJoin(spells, eq(characterSpells.spellId, spells.id))
    .where(eq(characterSpells.characterId, characterId))
    .orderBy(asc(characterSpells.sortOrder), asc(characterSpells.createdAt));
};

/**
 * Re-reads one row through the join. A second round trip on create and update,
 * which is what it costs for both paths to answer with the same shape.
 */
export const selectCharacterSpell = async (
  rowId: string
): Promise<CharacterSpellResponse | null> => {
  const rows = await db
    .select(spellSelection)
    .from(characterSpells)
    .leftJoin(spells, eq(characterSpells.spellId, spells.id))
    .where(eq(characterSpells.id, rowId));

  return rows[0] ? toCharacterSpell(rows[0]) : null;
};
