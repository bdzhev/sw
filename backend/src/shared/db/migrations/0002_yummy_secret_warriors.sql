CREATE TYPE "public"."attack_ability" AS ENUM('strength', 'dexterity', 'finesse');--> statement-breakpoint
CREATE TYPE "public"."attack_delivery" AS ENUM('melee', 'thrown', 'ranged-bow', 'ranged-firearm');--> statement-breakpoint
CREATE TYPE "public"."damage_type" AS ENUM('acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder');--> statement-breakpoint
CREATE TYPE "public"."reset_trigger" AS ENUM('short', 'long', 'both', 'manual');--> statement-breakpoint
CREATE TYPE "public"."spellcasting_progression" AS ENUM('full', 'half', 'third', 'pact', 'none', 'custom');--> statement-breakpoint
CREATE TYPE "public"."trait_tag" AS ENUM('race', 'class', 'other');--> statement-breakpoint
CREATE TABLE "attacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"name" text NOT NULL,
	"ability" "attack_ability" NOT NULL,
	"delivery" "attack_delivery" NOT NULL,
	"proficient" boolean DEFAULT false NOT NULL,
	"damage_dice" text,
	"damage_type" "damage_type",
	"additional_bonus" integer DEFAULT 0 NOT NULL,
	"ammo_remaining" integer,
	"properties" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"quick_reference" boolean DEFAULT false NOT NULL,
	"pin_order" integer DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_sheets" (
	"character_id" uuid PRIMARY KEY NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"str" integer DEFAULT 10 NOT NULL,
	"dex" integer DEFAULT 10 NOT NULL,
	"con" integer DEFAULT 10 NOT NULL,
	"int_score" integer DEFAULT 10 NOT NULL,
	"wis" integer DEFAULT 10 NOT NULL,
	"cha" integer DEFAULT 10 NOT NULL,
	"save_proficiencies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"skill_proficiencies" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"hp_current" integer DEFAULT 0 NOT NULL,
	"hp_max" integer DEFAULT 0 NOT NULL,
	"temp_hp" integer DEFAULT 0 NOT NULL,
	"ac" integer DEFAULT 10 NOT NULL,
	"speed" integer DEFAULT 30 NOT NULL,
	"initiative_bonus" integer DEFAULT 0 NOT NULL,
	"inspiration" boolean DEFAULT false NOT NULL,
	"hit_dice_remaining" integer DEFAULT 1 NOT NULL,
	"death_save_successes" integer DEFAULT 0 NOT NULL,
	"death_save_failures" integer DEFAULT 0 NOT NULL,
	"conditions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"languages" jsonb DEFAULT '{"standard":[],"other":""}'::jsonb NOT NULL,
	"spellcasting_progression" "spellcasting_progression" DEFAULT 'none' NOT NULL,
	"spell_slots" jsonb DEFAULT '{"current":{}}'::jsonb NOT NULL,
	"gp" integer DEFAULT 0 NOT NULL,
	"sp" integer DEFAULT 0 NOT NULL,
	"cp" integer DEFAULT 0 NOT NULL,
	"setup_completed_at" timestamp,
	"last_write_seq" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_spells" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"spell_id" uuid,
	"custom_name" text,
	"custom_description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "character_spells_reference_xor_custom" CHECK (("character_spells"."spell_id" IS NOT NULL AND "character_spells"."custom_name" IS NULL)
          OR ("character_spells"."spell_id" IS NULL AND "character_spells"."custom_name" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "class_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"resource_key" text NOT NULL,
	"is_custom" boolean DEFAULT false NOT NULL,
	"max_value" integer,
	"current" integer DEFAULT 0 NOT NULL,
	"reset_trigger" "reset_trigger" NOT NULL,
	"description" text,
	"quick_reference" boolean DEFAULT false NOT NULL,
	"pin_order" integer DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"quantity" integer DEFAULT 1 NOT NULL,
	"quick_reference" boolean DEFAULT false NOT NULL,
	"max_uses" integer,
	"uses_remaining" integer,
	"reset_on_long_rest" boolean DEFAULT false NOT NULL,
	"stat_modifiers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_equipped" boolean DEFAULT false NOT NULL,
	"pin_order" integer DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spells" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"level" integer NOT NULL,
	"school" text,
	"classes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"casting_time" text,
	"range_text" text,
	"components" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"duration" text,
	"concentration" boolean DEFAULT false NOT NULL,
	"ritual" boolean DEFAULT false NOT NULL,
	"description" text,
	"higher_level" text,
	CONSTRAINT "spells_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "traits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"tag" "trait_tag" NOT NULL,
	"quick_reference" boolean DEFAULT false NOT NULL,
	"pin_order" integer DEFAULT 0 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."character_status";--> statement-breakpoint
CREATE TYPE "public"."character_status" AS ENUM('active', 'pending');--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "status" SET DATA TYPE character_status USING "status"::character_status;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "lore" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "appearance" text;--> statement-breakpoint
ALTER TABLE "attacks" ADD CONSTRAINT "attacks_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_sheets" ADD CONSTRAINT "character_sheets_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_spells" ADD CONSTRAINT "character_spells_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_spells" ADD CONSTRAINT "character_spells_spell_id_spells_id_fk" FOREIGN KEY ("spell_id") REFERENCES "public"."spells"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_resources" ADD CONSTRAINT "class_resources_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traits" ADD CONSTRAINT "traits_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attacks_character_id_idx" ON "attacks" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "character_spells_character_id_idx" ON "character_spells" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "class_resources_character_id_idx" ON "class_resources" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "inventory_items_character_id_idx" ON "inventory_items" USING btree ("character_id");--> statement-breakpoint
CREATE INDEX "spells_level_idx" ON "spells" USING btree ("level");--> statement-breakpoint
CREATE INDEX "spells_lower_name_idx" ON "spells" USING btree (lower("name"));--> statement-breakpoint
CREATE INDEX "traits_character_id_idx" ON "traits" USING btree ("character_id");