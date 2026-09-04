import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const characterClassEnum = pgEnum('character_class', [
  'barbarian',
  'bard',
  'cleric',
  'druid',
  'fighter',
  'monk',
  'paladin',
  'ranger',
  'rogue',
  'sorcerer',
  'warlock',
  'wizard',
]);

// `pending` = quiz not generated yet (the sheet route sends these to the quiz),
// `active` = it has. Setup state is `character_sheets.setup_completed_at`, not a
// third status.
export const characterStatusEnum = pgEnum('character_status', [
  'active',
  'pending',
]);

export const characterRaceEnum = pgEnum('character_race', [
  'human',
  'elf',
  'dwarf',
  'halfling',
  'gnome',
  'half-orc',
  'tiefling',
  'dragonborn',
  'half-elf',
]);

export const characters = pgTable('characters', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id')
    .notNull()
    .references(() => {
      return users.id;
    }),
  name: text('name').notNull(),
  status: characterStatusEnum('status').notNull(),
  // The column stays `class`; the TS property does not, because `class` is a
  // reserved word and leaks a Raw*-type + mapper layer onto the frontend.
  characterClass: characterClassEnum('class').notNull(),
  race: characterRaceEnum('race').notNull(),
  lore: text('lore'),
  appearance: text('appearance'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: integer('user_id')
    .notNull()
    .references(() => {
      return users.id;
    }),
  refreshTokenHash: text('refresh_token_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const spellcastingProgressionEnum = pgEnum('spellcasting_progression', [
  'full',
  'half',
  'third',
  'pact',
  'none',
  'custom',
]);

/**
 * 1:1 play-state, split from the identity row above because it is a different
 * write channel: this whole row is the autosave controller's `character` target
 * and the controller is its only writer. The row is born with the character.
 *
 * Derived values are deliberately absent — modifiers, proficiency bonus, save
 * and skill totals, passive perception, initiative total, spell save DC and
 * resource maxima are all computed on the frontend from these columns. `hp_max`
 * is one exception: hp per level is rolled by the player. Spell slot maxima are
 * the other — they used to be derived from the class tables and are now typed
 * in, so they live in `spell_slots.max` below.
 */
export const characterSheets = pgTable('character_sheets', {
  characterId: uuid('character_id')
    .primaryKey()
    .references(
      () => {
        return characters.id;
      },
      { onDelete: 'cascade' }
    ),
  // Changes only through the level-up action, never through autosave.
  level: integer('level').notNull().default(1),
  str: integer('str').notNull().default(10),
  dex: integer('dex').notNull().default(10),
  con: integer('con').notNull().default(10),
  // `int` is a type name in SQL; the column is `int_score` to keep it unquoted.
  intScore: integer('int_score').notNull().default(10),
  wis: integer('wis').notNull().default(10),
  cha: integer('cha').notNull().default(10),
  /** Ability keys the character is proficient in: `['str', 'con']`. */
  saveProficiencies: jsonb('save_proficiencies')
    .notNull()
    .default(sql`'[]'::jsonb`),
  /** Skill key -> multiplier: `{ stealth: 1, perception: 2 }` (2 = expertise). */
  skillProficiencies: jsonb('skill_proficiencies')
    .notNull()
    .default(sql`'{}'::jsonb`),
  hpCurrent: integer('hp_current').notNull().default(0),
  hpMax: integer('hp_max').notNull().default(0),
  tempHp: integer('temp_hp').notNull().default(0),
  ac: integer('ac').notNull().default(10),
  speed: integer('speed').notNull().default(30),
  /** Misc initiative bonuses (Alert feat etc); the dex half is derived. */
  initiativeBonus: integer('initiative_bonus').notNull().default(0),
  inspiration: boolean('inspiration').notNull().default(false),
  hitDiceRemaining: integer('hit_dice_remaining').notNull().default(1),
  deathSaveSuccesses: integer('death_save_successes').notNull().default(0),
  deathSaveFailures: integer('death_save_failures').notNull().default(0),
  /** Name badges only — no mechanical effects are encoded. */
  conditions: jsonb('conditions')
    .notNull()
    .default(sql`'[]'::jsonb`),
  /** `{ standard: string[], other: string }` — not a joined string. */
  languages: jsonb('languages')
    .notNull()
    .default(sql`'{"standard":[],"other":""}'::jsonb`),
  spellcastingProgression: spellcastingProgressionEnum(
    'spellcasting_progression'
  )
    .notNull()
    .default('none'),
  /**
   * `{ current: { "1".."9": int }, max: { "1".."9": int } }`. Both halves are
   * player-entered for every character — the class tables no longer drive the
   * grid, so `max` is not derivable from `spellcasting_progression` and is the
   * only record of what the pool is. `max` stays optional in the type for rows
   * written before that change.
   */
  spellSlots: jsonb('spell_slots')
    .notNull()
    .default(sql`'{"current":{}}'::jsonb`),
  gp: integer('gp').notNull().default(0),
  sp: integer('sp').notNull().default(0),
  cp: integer('cp').notNull().default(0),
  /** null = the post-quiz setup flow has not run. Write-once. */
  setupCompletedAt: timestamp('setup_completed_at'),
  /**
   * Bumped on every write. The stale-write WHERE guard is v2; what uses it now
   * is the client's localStorage buffer, which discards itself when the fetched
   * row is newer than the buffer's base.
   */
  lastWriteSeq: bigint('last_write_seq', { mode: 'number' })
    .notNull()
    .default(0),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** strength / dexterity / finesse — finesse means `max(strMod, dexMod)`. */
export const attackAbilityEnum = pgEnum('attack_ability', [
  'strength',
  'dexterity',
  'finesse',
]);

/** Independent of ability; gates whether ammo is tracked. */
export const attackDeliveryEnum = pgEnum('attack_delivery', [
  'melee',
  'thrown',
  'ranged-bow',
  'ranged-firearm',
]);

export const damageTypeEnum = pgEnum('damage_type', [
  'acid',
  'bludgeoning',
  'cold',
  'fire',
  'force',
  'lightning',
  'necrotic',
  'piercing',
  'poison',
  'psychic',
  'radiant',
  'slashing',
  'thunder',
]);

/**
 * `sort_order` + `created_at` are on every sub-table for the same reason: these
 * are player-curated lists, Postgres guarantees no row order, and an UPDATE can
 * physically move a row — so toggling one pin could reshuffle the list under
 * the player, which reads as a bug with no client-side fix.
 *
 * `quick_reference` + `pin_order` are the pin mechanism on the four pinnable
 * tables, read as a union client-side by the quick-access overlay rather than
 * through a polymorphic pinned_items table.
 */
export const attacks = pgTable(
  'attacks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    characterId: uuid('character_id')
      .notNull()
      .references(
        () => {
          return characters.id;
        },
        { onDelete: 'cascade' }
      ),
    name: text('name').notNull(),
    ability: attackAbilityEnum('ability').notNull(),
    delivery: attackDeliveryEnum('delivery').notNull(),
    proficient: boolean('proficient').notNull().default(false),
    /** Freeform, e.g. `1d8` — matches how players write it on paper. */
    damageDice: text('damage_dice'),
    damageType: damageTypeEnum('damage_type'),
    /** Numeric, feeds both attack and damage. Extra damage *dice* don't fit. */
    additionalBonus: integer('additional_bonus').notNull().default(0),
    /** Tracked only for thrown and ranged-firearm delivery. */
    ammoRemaining: integer('ammo_remaining'),
    /** Descriptive tags (versatile, reach, light, heavy, two-handed). */
    properties: jsonb('properties')
      .notNull()
      .default(sql`'[]'::jsonb`),
    quickReference: boolean('quick_reference').notNull().default(false),
    pinOrder: integer('pin_order').notNull().default(0),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return [index('attacks_character_id_idx').on(table.characterId)];
  }
);

export const traitTagEnum = pgEnum('trait_tag', ['race', 'class', 'other']);

export const traits = pgTable(
  'traits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    characterId: uuid('character_id')
      .notNull()
      .references(
        () => {
          return characters.id;
        },
        { onDelete: 'cascade' }
      ),
    name: text('name').notNull(),
    description: text('description'),
    tag: traitTagEnum('tag').notNull(),
    quickReference: boolean('quick_reference').notNull().default(false),
    pinOrder: integer('pin_order').notNull().default(0),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return [index('traits_character_id_idx').on(table.characterId)];
  }
);

/** A long rest restores everything a short rest does, so `both` is real. */
export const resetTriggerEnum = pgEnum('reset_trigger', [
  'short',
  'long',
  'both',
  'manual',
]);

export const classResources = pgTable(
  'class_resources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    characterId: uuid('character_id')
      .notNull()
      .references(
        () => {
          return characters.id;
        },
        { onDelete: 'cascade' }
      ),
    /** Key into the hardcoded resource list, or the freeform name if custom. */
    resourceKey: text('resource_key').notNull(),
    isCustom: boolean('is_custom').notNull().default(false),
    /**
     * Null unless `is_custom`. A stored max for Rage would go stale at levels
     * 3/6/12/17; known resources derive theirs from the class table at render.
     */
    maxValue: integer('max_value'),
    current: integer('current').notNull().default(0),
    /**
     * Stored on every row, including known ones, because the rest endpoint has
     * to know what resets without the backend owning a copy of the class table.
     */
    resetTrigger: resetTriggerEnum('reset_trigger').notNull(),
    description: text('description'),
    quickReference: boolean('quick_reference').notNull().default(false),
    pinOrder: integer('pin_order').notNull().default(0),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return [index('class_resources_character_id_idx').on(table.characterId)];
  }
);

export const inventoryItems = pgTable(
  'inventory_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    characterId: uuid('character_id')
      .notNull()
      .references(
        () => {
          return characters.id;
        },
        { onDelete: 'cascade' }
      ),
    name: text('name').notNull(),
    description: text('description'),
    quantity: integer('quantity').notNull().default(1),
    quickReference: boolean('quick_reference').notNull().default(false),
    maxUses: integer('max_uses'),
    usesRemaining: integer('uses_remaining'),
    resetOnLongRest: boolean('reset_on_long_rest').notNull().default(false),
    /**
     * e.g. `{ str: 2 }`. The totals are derived in derived-stats from the rows
     * the sheet already holds — never stored on character_sheets, which would
     * make an item endpoint a second writer of the autosave row.
     */
    statModifiers: jsonb('stat_modifiers')
      .notNull()
      .default(sql`'{}'::jsonb`),
    /** Only equipped items grant their bonuses. */
    isEquipped: boolean('is_equipped').notNull().default(false),
    pinOrder: integer('pin_order').notNull().default(0),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return [index('inventory_items_character_id_idx').on(table.characterId)];
  }
);

/** Shared read-only reference library, seeded via `bun run db:seed`. */
export const spells = pgTable(
  'spells',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    level: integer('level').notNull(),
    school: text('school'),
    /** Class keys the spell is legal for, for the standard search filter. */
    classes: jsonb('classes')
      .notNull()
      .default(sql`'[]'::jsonb`),
    castingTime: text('casting_time'),
    rangeText: text('range_text'),
    components: jsonb('components')
      .notNull()
      .default(sql`'[]'::jsonb`),
    duration: text('duration'),
    concentration: boolean('concentration').notNull().default(false),
    ritual: boolean('ritual').notNull().default(false),
    description: text('description'),
    higherLevel: text('higher_level'),
  },
  (table) => {
    return [
      index('spells_level_idx').on(table.level),
      index('spells_lower_name_idx').on(sql`lower(${table.name})`),
    ];
  }
);

/**
 * The player's own flat list. `spell_id IS NULL` already means "custom", so
 * there is no `is_custom` column to drift — the CHECK enforces the real
 * invariant. Note it also forbids "reference spell + my own note": fine for
 * v1, but a personal-notes feature needs a migration, not a column write.
 */
export const characterSpells = pgTable(
  'character_spells',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    characterId: uuid('character_id')
      .notNull()
      .references(
        () => {
          return characters.id;
        },
        { onDelete: 'cascade' }
      ),
    spellId: uuid('spell_id').references(() => {
      return spells.id;
    }),
    customName: text('custom_name'),
    customDescription: text('custom_description'),
    /**
     * Only meaningful for a custom entry — a reference spell's level comes off
     * the join. Nullable rather than defaulted: rows added before casting
     * existed have no level, and no level means no cast button, which is the
     * honest answer rather than pretending they are cantrips.
     */
    customLevel: integer('custom_level'),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return [
      index('character_spells_character_id_idx').on(table.characterId),
      check(
        'character_spells_reference_xor_custom',
        sql`(${table.spellId} IS NOT NULL AND ${table.customName} IS NULL)
          OR (${table.spellId} IS NULL AND ${table.customName} IS NOT NULL)`
      ),
    ];
  }
);
