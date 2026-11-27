export const m20261125: string[] = [
	`create table "review_reply" (
		"id" uuid not null,
		"review_id" uuid not null,
		"user_id" uuid not null,
		"parent_id" uuid null,
		"text" text not null,
		"depth" integer not null,
		"created_at" timestamptz not null,
		"updated_at" timestamptz not null,
		constraint "review_reply_pkey" primary key ("id"),
		constraint "review_reply_review_id_foreign" foreign key ("review_id") references "review" ("id") on delete cascade,
		constraint "review_reply_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade,
		constraint "review_reply_parent_id_foreign" foreign key ("parent_id") references "review_reply" ("id") on delete cascade
	);`,
	`create index "review_reply_review_created_at_index" on "review_reply" ("review_id", "created_at");`,
	`create index "review_reply_parent_id_index" on "review_reply" ("parent_id");`,
];
