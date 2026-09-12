export const m20260718f: string[] = [
	`
BEGIN;

-- 1. DROP ALL FOREIGN KEYS
ALTER TABLE "historic_site" DROP CONSTRAINT IF EXISTS "historic_site_region_id_foreign";
ALTER TABLE "historic_site" DROP CONSTRAINT IF EXISTS "historic_site_country_id_foreign";
ALTER TABLE "region" DROP CONSTRAINT IF EXISTS "region_country_id_foreign";
ALTER TABLE "subscription" DROP CONSTRAINT IF EXISTS "subscription_subscription_level_id_foreign";
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_subscription_id_foreign";
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_user_id_foreign";

-- 2. CREATE MAPPING TABLES FOR UUID MIGRATION
CREATE TEMP TABLE region_map (old_id TEXT, new_id TEXT);
INSERT INTO region_map (old_id, new_id) SELECT id, gen_random_uuid()::text FROM "region";

-- 3. UPDATE FOREIGN KEYS IN CHILD TABLES
UPDATE "historic_site" SET "region_id" = m.new_id FROM region_map m WHERE "historic_site"."region_id" = m.old_id;

-- 4. UPDATE PRIMARY KEYS IN TARGET TABLES
UPDATE "region" SET "id" = m.new_id FROM region_map m WHERE "region"."id" = m.old_id;
UPDATE "city_cache" SET "id" = gen_random_uuid()::text;
UPDATE "forecast_cache" SET "id" = gen_random_uuid()::text;
UPDATE "historic_site" SET "id" = gen_random_uuid()::text;

-- 5. ENSURE TYPES ARE VARCHAR(255)
ALTER TABLE "region" ALTER COLUMN "id" TYPE VARCHAR(255);
ALTER TABLE "historic_site" ALTER COLUMN "id" TYPE VARCHAR(255);
ALTER TABLE "city_cache" ALTER COLUMN "id" TYPE VARCHAR(255);
ALTER TABLE "forecast_cache" ALTER COLUMN "id" TYPE VARCHAR(255);

-- 6. RESTORE FOREIGN KEYS
-- Note: Re-adding using the names you provided
ALTER TABLE "region" ADD CONSTRAINT "region_country_id_foreign" FOREIGN KEY ("country_id") REFERENCES "country" ("id");
ALTER TABLE "historic_site" ADD CONSTRAINT "historic_site_country_id_foreign" FOREIGN KEY ("country_id") REFERENCES "country" ("id");
ALTER TABLE "historic_site" ADD CONSTRAINT "historic_site_region_id_foreign" FOREIGN KEY ("region_id") REFERENCES "region" ("id");
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscription_level_id_foreign" FOREIGN KEY ("subscription_level_id") REFERENCES "subscription_level" ("id");
ALTER TABLE "user" ADD CONSTRAINT "user_subscription_id_foreign" FOREIGN KEY ("subscription_id") REFERENCES "subscription" ("id");
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id");

DROP TABLE region_map;

COMMIT;
	`,
];
