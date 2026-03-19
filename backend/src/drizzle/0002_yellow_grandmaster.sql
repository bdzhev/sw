CREATE TABLE "quiz_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"questions" jsonb NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"results" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_data_character_id_unique" UNIQUE("character_id")
);
--> statement-breakpoint
ALTER TABLE "quiz_data" ADD CONSTRAINT "quiz_data_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;