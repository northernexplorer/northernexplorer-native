export const m20260710: string[] = [
    `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_membership_id_foreign";`,
    `ALTER TABLE "membership" DROP CONSTRAINT IF EXISTS "membership_membership_level_id_foreign";`,
    `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "user_membership_id_unique";`,

    `ALTER TABLE "membership_level" RENAME TO "subscription_level";`,
    `ALTER TABLE "membership" RENAME TO "subscription";`,
    `ALTER TABLE "subscription" RENAME COLUMN "membership_level_id" TO "subscription_level_id";`,
    `ALTER TABLE "user" RENAME COLUMN "membership_id" TO "subscription_id";`,

    `ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscription_level_id_foreign" FOREIGN KEY ("subscription_level_id") REFERENCES "subscription_level" ("id");`,

    `ALTER TABLE "user" ADD CONSTRAINT "user_subscription_id_foreign" FOREIGN KEY ("subscription_id") REFERENCES "subscription" ("id");`,
    `ALTER TABLE "user" ADD CONSTRAINT "user_subscription_id_unique" UNIQUE ("subscription_id");`,
];
