export const m20260718d: string[] = [
	`BEGIN;

-- 1. DROP ALL FOREIGN KEYS TO ALLOW TYPE CHANGES
ALTER TABLE "subscription" DROP CONSTRAINT IF EXISTS "subscription_subscription_level_id_foreign";
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_subscription_id_foreign";
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_user_id_foreign";

-- 2. DROP DEFAULTS
ALTER TABLE "city_cache" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "forecast_cache" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "historic_site" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "subscription_level" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "subscription" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "session" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "weather_cache" ALTER COLUMN "id" DROP DEFAULT;

-- 3. FORCE ALL COLUMNS TO VARCHAR(255)
-- We cast from whatever they are currently (UUID or INT) to VARCHAR(255)
ALTER TABLE "subscription_level" ALTER COLUMN "id" TYPE VARCHAR(255) USING ("id"::VARCHAR(255));
ALTER TABLE "subscription" ALTER COLUMN "id" TYPE VARCHAR(255) USING ("id"::VARCHAR(255));
ALTER TABLE "subscription" ALTER COLUMN "subscription_level_id" TYPE VARCHAR(255) USING ("subscription_level_id"::VARCHAR(255));
ALTER TABLE "user" ALTER COLUMN "id" TYPE VARCHAR(255) USING ("id"::VARCHAR(255));
ALTER TABLE "user" ALTER COLUMN "subscription_id" TYPE VARCHAR(255) USING ("subscription_id"::VARCHAR(255));
ALTER TABLE "session" ALTER COLUMN "id" TYPE VARCHAR(255) USING ("id"::VARCHAR(255));
ALTER TABLE "session" ALTER COLUMN "user_id" TYPE VARCHAR(255) USING ("user_id"::VARCHAR(255));
ALTER TABLE "city_cache" ALTER COLUMN "id" TYPE VARCHAR(255) USING ("id"::VARCHAR(255));
ALTER TABLE "forecast_cache" ALTER COLUMN "id" TYPE VARCHAR(255) USING ("id"::VARCHAR(255));
ALTER TABLE "historic_site" ALTER COLUMN "id" TYPE VARCHAR(255) USING ("id"::VARCHAR(255));
ALTER TABLE "weather_cache" ALTER COLUMN "id" TYPE VARCHAR(255) USING ("id"::VARCHAR(255));

-- 4. CLEANUP ORPHANED COLUMNS
ALTER TABLE "city_cache" DROP COLUMN IF EXISTS "new_id";
ALTER TABLE "forecast_cache" DROP COLUMN IF EXISTS "new_id";
ALTER TABLE "historic_site" DROP COLUMN IF EXISTS "new_id";
ALTER TABLE "weather_cache" DROP COLUMN IF EXISTS "new_id";

-- 5. RE-APPLY CONSTRAINTS
ALTER TABLE "subscription" ALTER COLUMN "subscription_level_id" SET NOT NULL;
ALTER TABLE "user" ALTER COLUMN "subscription_id" SET NOT NULL;
ALTER TABLE "session" ALTER COLUMN "user_id" SET NOT NULL;

ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscription_level_id_foreign" FOREIGN KEY ("subscription_level_id") REFERENCES "subscription_level" ("id");
ALTER TABLE "user" ADD CONSTRAINT "user_subscription_id_foreign" FOREIGN KEY ("subscription_id") REFERENCES "subscription" ("id");
ALTER TABLE "user" ADD CONSTRAINT "user_subscription_id_unique" UNIQUE ("subscription_id");
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id");

  COMMIT;`,
];
