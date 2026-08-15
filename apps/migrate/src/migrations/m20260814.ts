export const m20260814: string[] = [
	// 1. Rename table and existing sequence / constraints
	'alter table "historic_site" rename to "point_of_interest";',
	'alter table "point_of_interest" rename constraint "historic_site_pkey" to "point_of_interest_pkey";',
	'alter table "point_of_interest" rename constraint "historic_site_name_unique" to "point_of_interest_name_unique";',
	'alter table "point_of_interest" rename constraint "historic_site_country_id_foreign" to "point_of_interest_country_id_foreign";',
	'alter table "point_of_interest" rename constraint "historic_site_region_id_foreign" to "point_of_interest_region_id_foreign";',

	// 2. Add column as nullable initially
	'alter table "point_of_interest" add column if not exists "type" text[] null;',

	// 3. Backfill all existing rows to HistoricSite
	'update "point_of_interest" set "type" = array[\'HistoricSite\'::text] where "type" is null or array_length("type", 1) is null;',

	// 4. Enforce NOT NULL and check constraints
	'alter table "point_of_interest" alter column "type" set not null;',
	'alter table "point_of_interest" add constraint "point_of_interest_type_check" check ("type" <@ array[\'Cave\'::text, \'HistoricSite\'::text, \'Waterfall\'::text]);',

	// 5. Update review foreign key reference
	'alter table "review" rename column "historic_site_id" to "point_of_interest_id";',
	'alter table "review" rename constraint "review_historic_site_id_foreign" to "review_point_of_interest_id_foreign";',

	// 6. Update user & review column constraints
	'alter table "user" alter column "score" drop default;',
	'alter table "review" drop constraint "review_rating_check";',
	'alter table "review" alter column "rating" type smallint using ("rating"::smallint);',
	'alter table "review" alter column "description" type varchar(255) using ("description"::varchar(255));',
	'alter table "review" alter column "description" set not null;',
];
