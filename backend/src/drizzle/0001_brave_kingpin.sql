CREATE TYPE "public"."character_class" AS ENUM('barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard');--> statement-breakpoint
CREATE TYPE "public"."character_race" AS ENUM('human', 'elf', 'dwarf', 'halfling', 'gnome', 'half-orc', 'tiefling', 'dragonborn', 'half-elf');--> statement-breakpoint
CREATE TYPE "public"."character_status" AS ENUM('active', 'draft');--> statement-breakpoint
CREATE TABLE "characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"status" character_status NOT NULL,
	"class" character_class NOT NULL,
	"race" character_race NOT NULL,
	"stats" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;