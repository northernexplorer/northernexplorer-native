export const m20260908: string[] = [
	`create table "image_like" ("id" uuid not null, "image_id" uuid not null, "user_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`,
	`alter table "image_like" add constraint "image_like_image_id_user_id_unique" unique ("image_id", "user_id");`,
	`alter table "image" drop column "likes";`,
	`alter table "image_like" add constraint "image_like_image_id_foreign" foreign key ("image_id") references "image" ("id") on delete cascade;`,
	`alter table "image_like" add constraint "image_like_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`,
];
