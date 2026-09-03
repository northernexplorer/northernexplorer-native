export const m20260904: string[] = [
	`create table "image" ("id" uuid not null, "version" int not null default 1, "url" text not null, "filename" varchar(255) not null, "mime_type" varchar(255) not null, "size" int not null, "alt_text" text null, "processed" boolean not null default false, "point_of_interest_id" uuid not null, primary key ("id"));`,
	`alter table "image" add constraint "image_point_of_interest_id_foreign" foreign key ("point_of_interest_id") references "point_of_interest" ("id") on delete cascade;`,
];
