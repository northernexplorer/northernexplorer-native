export const m20260718c: string[] = [
	`BEGIN;

  -- 1. ADD NEW UUID COLUMNS
  ALTER TABLE "subscription_level" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
  ALTER TABLE "subscription" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
  ALTER TABLE "user" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
  ALTER TABLE "session" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
  ALTER TABLE "city_cache" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
  ALTER TABLE "forecast_cache" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
  ALTER TABLE "historic_site" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
  ALTER TABLE "weather_cache" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();

  -- 2. CREATE TEMPORARY LINK COLUMNS
  ALTER TABLE "subscription" ADD COLUMN "new_subscription_level_id" UUID;
  ALTER TABLE "user" ADD COLUMN "new_subscription_id" UUID;
  ALTER TABLE "session" ADD COLUMN "new_user_id" UUID;

  -- 3. MIGRATE DATA
  UPDATE "subscription" SET "new_subscription_level_id" = "subscription_level"."new_id" FROM "subscription_level" WHERE "subscription"."subscription_level_id" = "subscription_level"."id";
  UPDATE "user" SET "new_subscription_id" = "subscription"."new_id" FROM "subscription" WHERE "user"."subscription_id" = "subscription"."id";
  UPDATE "session" SET "new_user_id" = "user"."new_id" FROM "user" WHERE "session"."user_id" = "user"."id";

  -- 4. DROP OLD CONSTRAINTS (Using CASCADE to safely handle dependencies)
  ALTER TABLE "subscription" DROP CONSTRAINT IF EXISTS "subscription_subscription_level_id_foreign";
  ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_subscription_id_foreign";
  ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_user_id_foreign";

  -- 5. SWAP PRIMARY KEYS (Using CASCADE to drop existing PK constraints automatically)
  -- Subscription Level
  ALTER TABLE "subscription_level" DROP CONSTRAINT IF EXISTS "subscription_level_pkey" CASCADE;
  ALTER TABLE "subscription_level" DROP COLUMN "id";
  ALTER TABLE "subscription_level" RENAME COLUMN "new_id" TO "id";
  ALTER TABLE "subscription_level" ADD PRIMARY KEY ("id");

  -- Subscription
  ALTER TABLE "subscription" DROP CONSTRAINT IF EXISTS "subscription_pkey" CASCADE;
  ALTER TABLE "subscription" DROP COLUMN "id";
  ALTER TABLE "subscription" RENAME COLUMN "new_id" TO "id";
  ALTER TABLE "subscription" ADD PRIMARY KEY ("id");
  ALTER TABLE "subscription" DROP COLUMN "subscription_level_id";
  ALTER TABLE "subscription" RENAME COLUMN "new_subscription_level_id" TO "subscription_level_id";

  -- User
  ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_pkey" CASCADE;
  ALTER TABLE "user" DROP COLUMN "id";
  ALTER TABLE "user" RENAME COLUMN "new_id" TO "id";
  ALTER TABLE "user" ADD PRIMARY KEY ("id");
  ALTER TABLE "user" DROP COLUMN "subscription_id";
  ALTER TABLE "user" RENAME COLUMN "new_subscription_id" TO "subscription_id";

  -- Session
  ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_pkey" CASCADE;
  ALTER TABLE "session" DROP COLUMN "id";
  ALTER TABLE "session" RENAME COLUMN "new_id" TO "id";
  ALTER TABLE "session" ADD PRIMARY KEY ("id");
  ALTER TABLE "session" DROP COLUMN "user_id";
  ALTER TABLE "session" RENAME COLUMN "new_user_id" TO "user_id";

  -- 6. RESTORE FOREIGN KEY CONSTRAINTS
  ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscription_level_id_foreign" FOREIGN KEY ("subscription_level_id") REFERENCES "subscription_level" ("id");
  ALTER TABLE "user" ADD CONSTRAINT "user_subscription_id_foreign" FOREIGN KEY ("subscription_id") REFERENCES "subscription" ("id");
  ALTER TABLE "session" ADD CONSTRAINT "session_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id");

  COMMIT;`,
];
