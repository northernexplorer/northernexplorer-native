export const m20260718e: string[] = [
	`
BEGIN;

-- 1. DROP ALL FOREIGN KEYS TO UNLOCK TABLES
ALTER TABLE "region" DROP CONSTRAINT IF EXISTS "region_country_id_foreign";
ALTER TABLE "historic_site" DROP CONSTRAINT IF EXISTS "historic_site_country_id_foreign";
ALTER TABLE "subscription" DROP CONSTRAINT IF EXISTS "subscription_subscription_level_id_foreign";
ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_subscription_id_foreign";
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_user_id_foreign";

-- 2. CREATE TEMP MAPPING FOR COUNTRY
CREATE TEMP TABLE country_id_mapping (old_id TEXT, new_id TEXT);
INSERT INTO country_id_mapping (old_id, new_id)
SELECT id, gen_random_uuid()::text FROM "country";

-- 3. UPDATE ALL CHILDREN OF COUNTRY
UPDATE "region" SET "country_id" = m.new_id FROM country_id_mapping m WHERE "region"."country_id" = m.old_id;
UPDATE "historic_site" SET "country_id" = m.new_id FROM country_id_mapping m WHERE "historic_site"."country_id" = m.old_id;

-- 4. UPDATE PARENT COUNTRY
UPDATE "country" SET "id" = m.new_id FROM country_id_mapping m WHERE "country"."id" = m.old_id;

-- 5. PERFORM OTHER ID CONVERSIONS (Same mapping logic)
-- If you need to convert region IDs to UUIDs, do the same mapping logic here.
-- If not, just ensure the ID column type is set:
ALTER TABLE "country" ALTER COLUMN "id" TYPE VARCHAR(255);

-- 6. RESTORE ALL FOREIGN KEYS
ALTER TABLE "region" ADD CONSTRAINT "region_country_id_foreign" FOREIGN KEY ("country_id") REFERENCES "country" ("id");
ALTER TABLE "historic_site" ADD CONSTRAINT "historic_site_country_id_foreign" FOREIGN KEY ("country_id") REFERENCES "country" ("id");
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscription_level_id_foreign" FOREIGN KEY ("subscription_level_id") REFERENCES "subscription_level" ("id");
ALTER TABLE "user" ADD CONSTRAINT "user_subscription_id_foreign" FOREIGN KEY ("subscription_id") REFERENCES "subscription" ("id");
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id");

DROP TABLE country_id_mapping;
COMMIT;
	`,
];
