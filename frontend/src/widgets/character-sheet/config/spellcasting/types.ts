/**
 * The create body for `/character/:id/spells`.
 *
 * Written out rather than taken from `CollectionCreate<CollectionKey.SPELLS>`:
 * `CharacterSpell` has no `characterId` for that alias to strip, so it would
 * leak the server-derived `spell` and `isCustom` into the payload. The
 * reference-xor-custom rule is the table's CHECK, enforced server-side.
 */
export interface SpellBody {
  spellId?: string;
  customName?: string;
  customDescription?: string | null;
  /** Custom entries only — without it there is nothing to spend a slot against. */
  customLevel?: number | null;
  sortOrder?: number;
}

/** The add dialog's two equally-weighted searches, plus the freeform escape. */
export const AddSpellMode = {
  STANDARD: 'standard',
  LIBRARY: 'library',
  CUSTOM: 'custom',
} as const;

export type AddSpellMode = (typeof AddSpellMode)[keyof typeof AddSpellMode];
