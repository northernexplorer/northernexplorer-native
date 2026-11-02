export const m20261030: string[] = [
	`create table "avatar" ("id" uuid not null, "version" int not null default 1, "url" text not null, "file_extension" varchar(255) not null, "filename" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null, "processed" boolean not null default false, "user_id" uuid not null, "created_at" timestamptz not null, "hash" varchar(255) not null, primary key ("id"));`,
	`create index "avatar_hash_index" on "avatar" ("hash");`,
	`alter table "avatar" add constraint "avatar_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`,
	`alter table "user" add column "avatar_id" uuid null;`,
	`alter table "user" add constraint "user_avatar_id_foreign" foreign key ("avatar_id") references "avatar" ("id") on delete set null;`,
];
