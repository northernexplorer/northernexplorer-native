export const m20261110b: string[] = [
	`create table "article_category" (
		"id" uuid not null,
		"name" text not null,
		constraint "article_category_pkey" primary key ("id"),
		constraint "article_category_name_unique" unique ("name")
	);`,
	`insert into "article_category" ("id", "name")
		select md5("name")::uuid, "name"
		from (
			select "category" as "name" from "article"
			union
			select 'Support'
		) as "category_names";`,
	`alter table "article" add column "category_id" uuid;`,
	`update "article" as "article"
		set "category_id" = "article_category"."id"
		from "article_category"
		where "article_category"."name" = "article"."category";`,
	`alter table "article" alter column "category_id" set not null;`,
	`alter table "article" drop column "category";`,
	`alter table "article" add constraint "article_category_id_foreign"
		foreign key ("category_id") references "article_category" ("id");`,
];
