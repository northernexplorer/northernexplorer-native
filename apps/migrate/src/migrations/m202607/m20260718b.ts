export const m20260718b: string[] = [
	`alter table "historic_site" drop constraint "fk_historic_site_country";`,
	`alter table "historic_site" drop constraint "fk_historic_site_region";`,

	`alter table "historic_site" alter column "country_id" type varchar(255) using ("country_id"::varchar(255));`,
	`alter table "historic_site" alter column "region_id" type varchar(255) using ("region_id"::varchar(255));`,
	`alter table "historic_site" add constraint "historic_site_country_id_foreign" foreign key ("country_id") references "country" ("id");`,
	`alter table "historic_site" add constraint "historic_site_region_id_foreign" foreign key ("region_id") references "region" ("id");`,
];
