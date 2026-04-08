-- Wipe all data first (cascade handles FK dependencies)
TRUNCATE TABLE quiz_data, characters, sessions, users RESTART IDENTITY CASCADE;

-- Drop old columns
ALTER TABLE "users" DROP COLUMN IF EXISTS "name";
ALTER TABLE "users" DROP COLUMN IF EXISTS "email";
ALTER TABLE "users" DROP COLUMN IF EXISTS "provider";
ALTER TABLE "users" DROP COLUMN IF EXISTS "provider_id";

-- Drop old unique constraint on (provider, provider_id)
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_provider_provider_id_unique";
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_unique";

-- Add new columns
ALTER TABLE "users" ADD COLUMN "username" text NOT NULL;
ALTER TABLE "users" ADD COLUMN "password" text NOT NULL;
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE ("username");
