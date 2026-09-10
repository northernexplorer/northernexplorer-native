export const m20260708: string[] = [
	`DROP TABLE IF EXISTS "mikro_orm_migrations" CASCADE;`,
	`alter table "historic_site" alter column "region" set not null;`,
	`alter table "user" drop constraint "user_user_name_unique";`,
	`alter table "user" rename column "user_name" to "username";`,
	`alter table "user" add constraint "user_username_unique" unique ("username");`,
];
