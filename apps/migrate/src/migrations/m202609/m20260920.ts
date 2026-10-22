export const m20260920: string[] = [
	`create table "point_of_interest_favorite" ("id" uuid not null, "point_of_interest_id" uuid not null, "user_id" uuid not null, "created_at" timestamptz not null, primary key ("id"));`,
	`alter table "point_of_interest_favorite" add constraint "point_of_interest_favorite_point_of_interest_id_user_id_unique"unique ("point_of_interest_id", "user_id");`,
	`alter table "point_of_interest_favorite" add constraint "point_of_interest_favorite_point_of_interest_id_foreign" foreign key ("point_of_interest_id") references "point_of_interest" ("id") on delete cascade;`,
	`alter table "point_of_interest_favorite" add constraint "point_of_interest_favorite_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`,
];
