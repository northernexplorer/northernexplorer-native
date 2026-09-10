export const m20260719: string[] = [
	`
BEGIN;

alter table "region" drop constraint "region_country_id_foreign";

alter table "historic_site" drop constraint "historic_site_country_id_foreign";
alter table "historic_site" drop constraint "historic_site_region_id_foreign";

alter table "subscription" drop constraint "subscription_subscription_level_id_foreign";

alter table "user" drop constraint "user_subscription_id_foreign";

alter table "session" drop constraint "session_user_id_foreign";

alter table "city_cache" alter column "id" type uuid using ("id"::text::uuid);

alter table "country" alter column "id" type uuid using ("id"::text::uuid);
alter table "country" alter column "name" type text using ("name"::text);

alter table "forecast_cache" alter column "id" type uuid using ("id"::text::uuid);

alter table "migration" alter column "migration_key" type text using ("migration_key"::text);

alter table "region" alter column "id" type uuid using ("id"::text::uuid);
alter table "region" alter column "name" type text using ("name"::text);
alter table "region" alter column "country_id" type uuid using ("country_id"::text::uuid);
alter table "region" add constraint "region_country_id_foreign" foreign key ("country_id") references "country" ("id");

alter table "historic_site" alter column "id" type uuid using ("id"::text::uuid);
alter table "historic_site" alter column "name" type text using ("name"::text);
alter table "historic_site" alter column "country_id" type uuid using ("country_id"::text::uuid);
alter table "historic_site" alter column "region_id" type uuid using ("region_id"::text::uuid);
alter table "historic_site" add constraint "historic_site_country_id_foreign" foreign key ("country_id") references "country" ("id");
alter table "historic_site" add constraint "historic_site_region_id_foreign" foreign key ("region_id") references "region" ("id");

alter table "subscription_level" alter column "id" type uuid using ("id"::text::uuid);

alter table "subscription" alter column "id" type uuid using ("id"::text::uuid);
alter table "subscription" alter column "subscription_level_id" type uuid using ("subscription_level_id"::text::uuid);
alter table "subscription" add constraint "subscription_subscription_level_id_foreign" foreign key ("subscription_level_id") references "subscription_level" ("id");

alter table "user" alter column "id" type uuid using ("id"::text::uuid);
alter table "user" alter column "subscription_id" type uuid using ("subscription_id"::text::uuid);
alter table "user" add constraint "user_subscription_id_foreign" foreign key ("subscription_id") references "subscription" ("id");

alter table "session" alter column "id" type uuid using ("id"::text::uuid);
alter table "session" alter column "user_id" type uuid using ("user_id"::text::uuid);
alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id");

alter table "weather_cache" alter column "id" type uuid using (
  CASE 
    WHEN "id"::text ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' 
    THEN "id"::uuid 
    ELSE gen_random_uuid() 
  END
);

COMMIT;
	`,
];
