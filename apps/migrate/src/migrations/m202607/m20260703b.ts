export const m20260703b: string[] = [
	`create table "user" ("id" varchar(255) not null, "version" int not null default 1, "first_name" text not null, "last_name" text not null, "user_name" text not null, "email" text not null, "email_activated_at" text not null, "created_at" timestamp not null, primary key ("id"));`,

	`drop index "idx_city_location";`,
	`drop index "idx_forecast_location";`,
	`drop index "idx_site_location";`,
	`drop index "idx_location";`,

	`alter table "historic_site" alter column "country" set not null;`,
];
