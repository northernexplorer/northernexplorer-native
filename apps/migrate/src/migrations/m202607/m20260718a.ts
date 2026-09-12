export const m20260718a: string[] = [
	`ALTER TABLE "subscription_level"
        ADD COLUMN "short_description" TEXT NOT NULL DEFAULT 'Coming Soon';`,
	`UPDATE "subscription_level"
SET "short_description" = 'Forever Free'
WHERE "id" = 1;`,
	`ALTER TABLE "subscription_level" 
ALTER COLUMN "short_description" DROP DEFAULT;`,
];
