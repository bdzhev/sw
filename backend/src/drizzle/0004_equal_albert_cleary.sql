CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" text NOT NULL DEFAULT 'google';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "provider" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "provider_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_provider_provider_id_unique" UNIQUE("provider","provider_id");