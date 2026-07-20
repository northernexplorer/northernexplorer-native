export const m20260718h: string[] = [
	`
BEGIN;
alter table "city_cache" alter column "lat" set not null;
alter table "city_cache" alter column "lon" set not null;
alter table "city_cache" alter column "city_data" set not null;
alter table "city_cache" alter column "updated_at" set not null;

alter table "country" alter column "version" set default 1;
alter table "country" alter column "version" set not null;
alter table "country" alter column "name" set not null;

alter table "forecast_cache" alter column "lat" set not null;
alter table "forecast_cache" alter column "lon" set not null;
alter table "forecast_cache" alter column "forecast_data" set not null;
alter table "forecast_cache" alter column "updated_at" set not null;

alter table "region" alter column "version" set default 1;
alter table "region" alter column "version" set not null;
alter table "region" alter column "name" set not null;
alter table "region" alter column "country_id" set not null;

alter table "historic_site" alter column "name" set not null;
alter table "historic_site" alter column "description" set not null;
alter table "historic_site" alter column "image" set not null;
alter table "historic_site" alter column "lat" set not null;
alter table "historic_site" alter column "lon" set not null;
alter table "historic_site" alter column "country_id" set not null;
alter table "historic_site" alter column "region_id" set not null;
alter table "historic_site" alter column "created_at" set not null;
alter table "historic_site" alter column "updated_at" set not null;
alter table "historic_site" alter column "version" set default 1;
alter table "historic_site" alter column "version" set not null;
alter table "historic_site" add constraint "historic_site_name_unique" unique ("name");

alter table "subscription_level" alter column "version" set default 1;
alter table "subscription_level" alter column "version" set not null;
alter table "subscription_level" alter column "name" set not null;
alter table "subscription_level" alter column "enabled" set not null;
alter table "subscription_level" alter column "cost" set not null;
alter table "subscription_level" alter column "description" set not null;
alter table "subscription_level" alter column "short_description" set not null;

alter table "subscription" alter column "version" set default 1;
alter table "subscription" alter column "version" set not null;
alter table "subscription" alter column "start_date" set not null;
alter table "subscription" alter column "renewal_date" set not null;
alter table "subscription" alter column "subscription_level_id" set not null;

alter table "user" alter column "version" set default 1;
alter table "user" alter column "version" set not null;
alter table "user" alter column "first_name" set not null;
alter table "user" alter column "last_name" set not null;
alter table "user" alter column "username" set not null;
alter table "user" alter column "email" set not null;
alter table "user" alter column "password_hash" set not null;
alter table "user" alter column "created_at" set not null;
alter table "user" alter column "is_active" set not null;
alter table "user" alter column "subscription_id" set not null;
alter table "user" add constraint "user_username_unique" unique ("username");
alter table "user" add constraint "user_email_unique" unique ("email");
alter table "user" add constraint "user_subscription_id_unique" unique ("subscription_id");

alter table "session" alter column "version" set default 1;
alter table "session" alter column "version" set not null;
alter table "session" alter column "client_name" set not null;
alter table "session" alter column "os_name" set not null;
alter table "session" alter column "platform" set not null;
alter table "session" alter column "ip_address" set not null;
alter table "session" alter column "refresh_token_hash" set not null;
alter table "session" alter column "first_login_at" set not null;
alter table "session" alter column "last_login_at" set not null;
alter table "session" alter column "expires_at" set not null;
alter table "session" alter column "user_id" set not null;

alter table "weather_cache" alter column "lat" set not null;
alter table "weather_cache" alter column "lon" set not null;
alter table "weather_cache" alter column "weather_data" set not null;
alter table "weather_cache" alter column "updated_at" set not null;

COMMIT;
	`,
];
