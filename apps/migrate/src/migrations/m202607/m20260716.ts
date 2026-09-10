export const m20260716: string[] = [
	`create table "session" ("id" serial primary key, "version" int not null default 1, "login_date" timestamptz not null, "client_name" text not null, "os_name" text not null, "platform" text not null, "ip_address" text not null, "refresh_token_hash" text not null, "first_login_at" timestamptz not null, "last_login_at" timestamptz not null, "expires_at" timestamptz not null, "user_id" int not null);`,
	`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id");`,
	`alter table "region" drop constraint "fk_region_country";`,
	`alter table "country" alter column "id" type varchar(255) using ("id"::varchar(255));`,
	`alter table "country" alter column "name" type varchar(255) using ("name"::varchar(255));`,
	`alter table "region" alter column "id" type varchar(255) using ("id"::varchar(255));`,
	`alter table "region" alter column "name" type varchar(255) using ("name"::varchar(255));`,
	`alter table "region" alter column "country_id" type varchar(255) using ("country_id"::varchar(255));`,
	`alter table "region" add constraint "region_country_id_foreign" foreign key ("country_id") references "country" ("id");`,
	`alter table "user" drop column "last_login_at";`,
];
