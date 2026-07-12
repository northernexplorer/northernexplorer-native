export const m20260705c: string[] = [
	`ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT;`,
	`ALTER TABLE "user" ALTER COLUMN "id" TYPE INTEGER USING ("id"::integer);`,
	`CREATE SEQUENCE IF NOT EXISTS "user_id_seq";`,
	`SELECT setval('user_id_seq', (SELECT COALESCE(MAX("id"), 0) FROM "user") + 1, false);`,
	`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT nextval('user_id_seq');`,
];
