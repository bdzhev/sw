import { integer, jsonb, pgEnum, pgTable, serial, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

type QuizCharacterStats = "str" | "dex" | "wis" | "int" | "cha";

type QuizResults = Record<string, QuizCharacterStats>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  provider: text("provider").notNull(),
  providerId: text("provider_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [unique().on(t.provider, t.providerId)]);

export const characterClassEnum = pgEnum("character_class", [
  "barbarian",
  "bard",
  "cleric",
  "druid",
  "fighter",
  "monk",
  "paladin",
  "ranger",
  "rogue",
  "sorcerer",
  "warlock",
  "wizard",
]);

export const characterStatusEnum = pgEnum("character_status", ["active", "draft"]);

export const characterRaceEnum = pgEnum("character_race", [
  "human",
  "elf",
  "dwarf",
  "halfling",
  "gnome",
  "half-orc",
  "tiefling",
  "dragonborn",
  "half-elf",
]);

export const characters = pgTable("characters", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull(),
  status: characterStatusEnum("status").notNull(),
  class: characterClassEnum("class").notNull(),
  race: characterRaceEnum("race").notNull(),
  stats: jsonb("stats"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizData = pgTable("quiz_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  characterId: uuid("character_id")
    .notNull()
    .unique()
    .references(() => characters.id),
  progress: integer("progress").notNull().default(0),
  results: jsonb("results").notNull().$type<QuizResults>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  refreshTokenHash: text("refresh_token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
