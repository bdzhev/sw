import { z } from 'zod';

import {
  description,
  isNotEmptyPatch,
  name,
  PATCH_EMPTY_MESSAGE,
  sortOrder,
} from '../collection.schemas';

/**
 * `spellId IS NULL` is what marks an entry custom, so there is no `isCustom`
 * field to drift — and the XOR below mirrors the table's CHECK constraint rather
 * than trusting the client to be consistent with it.
 *
 * Note this also forbids "reference spell plus my own note": fine for v1, but a
 * personal-notes feature needs a migration, not just a column write.
 */
const spellXor = <T extends { spellId?: unknown; customName?: unknown }>(
  entry: T
): boolean => {
  const hasReference = entry.spellId !== null && entry.spellId !== undefined;
  const hasCustom = entry.customName !== null && entry.customName !== undefined;

  return hasReference !== hasCustom;
};

const XOR_MESSAGE = 'Provide exactly one of spellId or customName';

const MAX_SPELL_LEVEL = 9;

const CUSTOM_LEVEL_MESSAGE = 'customLevel belongs to a custom entry only';

/** A custom entry's level, so it can be cast. A reference spell's comes off the join. */
const customLevel = z.number().int().min(0).max(MAX_SPELL_LEVEL).nullable();

export const spellFields = z.object({
  spellId: z.uuid().nullable(),
  customName: name.nullable(),
  customDescription: description,
  customLevel,
  sortOrder,
});

/** Nullable rather than absent, so clearing it back to "no level" stays legal. */
const customLevelOnlyWhenCustom = <
  T extends { spellId?: unknown; customLevel?: unknown },
>(
  entry: T
): boolean => {
  const hasReference = entry.spellId !== null && entry.spellId !== undefined;
  const hasLevel =
    entry.customLevel !== null && entry.customLevel !== undefined;

  return !hasReference || !hasLevel;
};

export const createSpellSchema = spellFields
  .partial({
    spellId: true,
    customName: true,
    customDescription: true,
    customLevel: true,
    sortOrder: true,
  })
  .refine(spellXor, { message: XOR_MESSAGE })
  .refine(customLevelOnlyWhenCustom, { message: CUSTOM_LEVEL_MESSAGE });

/**
 * The patch is checked the same way, but only when it touches either side —
 * reordering an entry must not have to restate its identity.
 */
export const updateSpellSchema = spellFields
  .partial()
  .strict()
  .refine(isNotEmptyPatch, { message: PATCH_EMPTY_MESSAGE })
  .refine(
    (patch) => {
      const touchesIdentity = 'spellId' in patch || 'customName' in patch;

      return !touchesIdentity || spellXor(patch);
    },
    { message: XOR_MESSAGE }
  )
  .refine(customLevelOnlyWhenCustom, { message: CUSTOM_LEVEL_MESSAGE });
