export const m20260710d: string[] = [
	`ALTER TABLE "subscription_level" ADD COLUMN "description" text;`,
	`UPDATE "subscription_level" SET "description" = 'Coming Soon' WHERE "id" BETWEEN 1 AND 5;`,
	`UPDATE "subscription_level" SET "description" = 'Coming Soon' WHERE "description" IS NULL;`,
	`ALTER TABLE "subscription_level" ALTER COLUMN "description" SET NOT NULL;`,
];
