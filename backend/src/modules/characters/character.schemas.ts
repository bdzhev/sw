import { z } from 'zod';

import {
  characterClassEnum,
  characterRaceEnum,
  spellcastingProgressionEnum,
} from '@shared/db';

/**
 * Enum members come off the Drizzle `pgEnum`s rather than being retyped, so a
 * schema change cannot leave the validator accepting a value Postgres rejects
 * (or refusing one it added).
 */
const characterClass = z.enum(characterClassEnum.enumValues);
const race = z.enum(characterRaceEnum.enumValues);

const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

/** Slot levels are jsonb object keys, so they are the strings '1'..'9'. */
const SLOT_LEVEL_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

const MAX_NAME_LENGTH = 100;
const MAX_ABILITY_SCORE = 30;
const MAX_COUNTER = 9999;
const MAX_DEATH_SAVES = 3;
const MAX_SLOT_COUNT = 99;
const MAX_TEXT_LENGTH = 4000;
const MAX_CONDITIONS = 20;
const MAX_CONDITION_LENGTH = 40;

const counter = z.number().int().min(0).max(MAX_COUNTER);

export const createCharacterSchema = z.object({
  name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  characterClass,
  race,
});

/** Mirrored by PAGE_SIZE in the frontend's shared/api/characters. */
export const PAGE_SIZE = 10;

const MAX_PAGE_SIZE = 100;

export const characterListQuerySchema = z.object({
  // Query params arrive as strings; coerce, then bound `limit` so a client
  // cannot ask for the whole table in one page.
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(PAGE_SIZE),
});

/**
 * Identity fields — the explicit-save channel. Partial by design, but not
 * empty: the dashboard rename sends `{ name }` alone and must keep working,
 * while a body with no known field is a client bug worth a 400.
 */
export const updateCharacterSchema = z
  .object({
    name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
    lore: z.string().max(MAX_TEXT_LENGTH).nullable(),
    appearance: z.string().max(MAX_TEXT_LENGTH).nullable(),
  })
  .partial()
  .strict()
  .refine(
    (patch) => {
      return Object.keys(patch).length > 0;
    },
    { message: 'Provide at least one of: name, lore, appearance' }
  );

/**
 * The autosave controller's target. `.strict()` is the point of this schema as
 * much as the field types are: `level` moves only through the level-up action,
 * and silently dropping it from an autosave body would let a caller believe a
 * write it never got had succeeded. `setup_completed_at`, `last_write_seq` and
 * `updated_at` are server-owned for the same reason.
 */
export const updateSheetSchema = z
  .object({
    str: z.number().int().min(1).max(MAX_ABILITY_SCORE),
    dex: z.number().int().min(1).max(MAX_ABILITY_SCORE),
    con: z.number().int().min(1).max(MAX_ABILITY_SCORE),
    intScore: z.number().int().min(1).max(MAX_ABILITY_SCORE),
    wis: z.number().int().min(1).max(MAX_ABILITY_SCORE),
    cha: z.number().int().min(1).max(MAX_ABILITY_SCORE),
    saveProficiencies: z.array(z.enum(ABILITY_KEYS)),
    /** 1 = proficient, 2 = expertise; absent = neither. */
    skillProficiencies: z.record(
      z.string(),
      z.union([z.literal(1), z.literal(2)])
    ),
    hpCurrent: z.number().int().max(MAX_COUNTER),
    hpMax: counter,
    tempHp: counter,
    ac: counter,
    speed: counter,
    initiativeBonus: z.number().int().min(-MAX_COUNTER).max(MAX_COUNTER),
    inspiration: z.boolean(),
    hitDiceRemaining: counter,
    deathSaveSuccesses: z.number().int().min(0).max(MAX_DEATH_SAVES),
    deathSaveFailures: z.number().int().min(0).max(MAX_DEATH_SAVES),
    /** Name badges only. Capped because the sheet GET returns this column in full. */
    conditions: z
      .array(z.string().trim().min(1).max(MAX_CONDITION_LENGTH))
      .max(MAX_CONDITIONS),
    languages: z.object({
      standard: z.array(z.string()),
      other: z.string(),
    }),
    spellcastingProgression: z.enum(spellcastingProgressionEnum.enumValues),
    spellSlots: z.object({
      current: z.partialRecord(
        z.enum(SLOT_LEVEL_KEYS),
        z.number().int().min(0).max(MAX_SLOT_COUNT)
      ),
      /** Present only for `custom` progression; derived otherwise. */
      max: z
        .partialRecord(
          z.enum(SLOT_LEVEL_KEYS),
          z.number().int().min(0).max(MAX_SLOT_COUNT)
        )
        .optional(),
    }),
    gp: counter,
    sp: counter,
    cp: counter,
  })
  .partial()
  .strict()
  .refine(
    (patch) => {
      return Object.keys(patch).length > 0;
    },
    { message: 'No writable sheet fields in body' }
  );

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;
export type UpdateSheetInput = z.infer<typeof updateSheetSchema>;
