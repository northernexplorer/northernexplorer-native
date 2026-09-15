export const m20260912: string[] = [
	`create table "review_like" ("id" uuid not null, "review_id" uuid not null, "user_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`,
	`alter table "review_like" add constraint "review_like_review_id_user_id_unique" unique ("review_id", "user_id");`,
	`alter table "review_like" add constraint "review_like_review_id_foreign" foreign key ("review_id") references "review" ("id") on delete cascade;`,
	`alter table "review_like" add constraint "review_like_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`,
];
