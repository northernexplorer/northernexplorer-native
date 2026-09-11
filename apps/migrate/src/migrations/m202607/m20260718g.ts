export const m20260718g: string[] = [
	`
BEGIN;

-- 1. PERFORM REBUILDS (Using your generated plan)
CREATE TABLE "city_cache_new" AS SELECT id, lat, lon, city_data, updated_at FROM "city_cache";
DROP TABLE "city_cache" CASCADE;
ALTER TABLE "city_cache_new" RENAME TO "city_cache";
ALTER TABLE "city_cache" ADD PRIMARY KEY (id);

CREATE TABLE "country_new" AS SELECT id, version, name FROM "country";
DROP TABLE "country" CASCADE;
ALTER TABLE "country_new" RENAME TO "country";
ALTER TABLE "country" ADD PRIMARY KEY (id);

CREATE TABLE "forecast_cache_new" AS SELECT id, lat, lon, forecast_data, updated_at FROM "forecast_cache";
DROP TABLE "forecast_cache" CASCADE;
ALTER TABLE "forecast_cache_new" RENAME TO "forecast_cache";
ALTER TABLE "forecast_cache" ADD PRIMARY KEY (id);

CREATE TABLE "historic_site_new" AS SELECT id, name, description, image, lat, lon, country_id, region_id, created_at, updated_at, version, start_date, end_date FROM "historic_site";
DROP TABLE "historic_site" CASCADE;
ALTER TABLE "historic_site_new" RENAME TO "historic_site";
ALTER TABLE "historic_site" ADD PRIMARY KEY (id);

CREATE TABLE "region_new" AS SELECT id, version, name, country_id FROM "region";
DROP TABLE "region" CASCADE;
ALTER TABLE "region_new" RENAME TO "region";
ALTER TABLE "region" ADD PRIMARY KEY (id);

CREATE TABLE "session_new" AS SELECT id, version, client_name, os_name, platform, ip_address, refresh_token_hash, first_login_at, last_login_at, expires_at, user_id FROM "session";
DROP TABLE "session" CASCADE;
ALTER TABLE "session_new" RENAME TO "session";
ALTER TABLE "session" ADD PRIMARY KEY (id);

CREATE TABLE "subscription_new" AS SELECT id, version, start_date, end_date, renewal_date, subscription_level_id FROM "subscription";
DROP TABLE "subscription" CASCADE;
ALTER TABLE "subscription_new" RENAME TO "subscription";
ALTER TABLE "subscription" ADD PRIMARY KEY (id);

CREATE TABLE "subscription_level_new" AS SELECT id, version, name, enabled, cost, description, short_description FROM "subscription_level";
DROP TABLE "subscription_level" CASCADE;
ALTER TABLE "subscription_level_new" RENAME TO "subscription_level";
ALTER TABLE "subscription_level" ADD PRIMARY KEY (id);

CREATE TABLE "user_new" AS SELECT id, version, first_name, last_name, username, email, password_hash, created_at, is_active, subscription_id FROM "user";
DROP TABLE "user" CASCADE;
ALTER TABLE "user_new" RENAME TO "user";
ALTER TABLE "user" ADD PRIMARY KEY (id);

CREATE TABLE "weather_cache_new" AS SELECT id, lat, lon, weather_data, updated_at FROM "weather_cache";
DROP TABLE "weather_cache" CASCADE;
ALTER TABLE "weather_cache_new" RENAME TO "weather_cache";
ALTER TABLE "weather_cache" ADD PRIMARY KEY (id);

-- 2. RESTORE CONSTRAINTS (Crucial!)
-- Add your Foreign Keys back here
ALTER TABLE "region" ADD CONSTRAINT "region_country_id_foreign" FOREIGN KEY ("country_id") REFERENCES "country" ("id");
ALTER TABLE "historic_site" ADD CONSTRAINT "historic_site_country_id_foreign" FOREIGN KEY ("country_id") REFERENCES "country" ("id");
ALTER TABLE "historic_site" ADD CONSTRAINT "historic_site_region_id_foreign" FOREIGN KEY ("region_id") REFERENCES "region" ("id");
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscription_level_id_foreign" FOREIGN KEY ("subscription_level_id") REFERENCES "subscription_level" ("id");
ALTER TABLE "user" ADD CONSTRAINT "user_subscription_id_foreign" FOREIGN KEY ("subscription_id") REFERENCES "subscription" ("id");
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id");

COMMIT;
	`,
];
