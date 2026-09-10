export const m20260707: string[] = [
	`create table "country" ("id" text primary key,"version" integer not null default 1,"name" text not null );`,
	`create table "region" ("id" text primary key,"version" integer not null default 1, "name" text not null,"country_id" text not null, constraint "fk_region_country" foreign key ("country_id") references "country" ("id") );`,
];
