export const m20261110: string[] = [
	`alter table "support" rename to "article";`,
	`alter table "article" drop constraint "support_category_check";`,
	`alter table "article" alter column "category" type text using "category"::text;`,
	`alter table "article" add column "subcategory" text;`,
	`update "article" set "subcategory" = "category", "category" = 'Support';`,
];
