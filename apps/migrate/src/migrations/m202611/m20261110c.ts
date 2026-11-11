export const m20261110c: string[] = [
	`alter table "article_category" drop constraint "article_category_name_unique";`,
	`alter table "article_category" add column "parent_id" uuid;`,
	`alter table "article_category" add constraint "article_category_parent_id_foreign"
		foreign key ("parent_id") references "article_category" ("id");`,
	`create unique index "article_category_root_name_unique"
		on "article_category" ("name") where "parent_id" is null;`,
	`create unique index "article_category_parent_name_unique"
		on "article_category" ("parent_id", "name") where "parent_id" is not null;`,
	`insert into "article_category" ("id", "name", "parent_id")
		select md5("legacy_categories"."parent_id"::text || ':' || "legacy_categories"."name")::uuid,
			"legacy_categories"."name", "legacy_categories"."parent_id"
		from (
			select distinct "category_id" as "parent_id", "subcategory" as "name"
			from "article"
			where "subcategory" is not null
		) as "legacy_categories";`,
	`update "article" as "article"
		set "category_id" = "subcategory"."id"
		from "article_category" as "subcategory"
		where "subcategory"."parent_id" = "article"."category_id"
			and "subcategory"."name" = "article"."subcategory";`,
	`alter table "article" drop column "subcategory";`,
];
