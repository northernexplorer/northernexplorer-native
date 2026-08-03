export const m20260803: string[] = [
	`alter table "user" add "roles" text[] null;`,
	`alter table "user" add constraint "user_roles_check" check ("roles" <@ array['Admin'::text]);`,
	`UPDATE "user" SET roles = ARRAY['Admin']::text[] WHERE id = 'e2f1386e-dd0a-474d-b782-54f0a3d6dd4a';`,
];
