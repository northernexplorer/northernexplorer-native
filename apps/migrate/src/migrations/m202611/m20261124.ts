export const m20261124: string[] = [
	`create table "notification" (
		"id" uuid not null,
		"user_id" uuid not null,
		"title" text not null,
		"message" text not null,
		"link" text null,
		"created_at" timestamptz not null,
		"read_at" timestamptz null,
		constraint "notification_pkey" primary key ("id"),
		constraint "notification_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade
	);`,
	`create index "notification_user_created_at_index" on "notification" ("user_id", "created_at");`,
];
