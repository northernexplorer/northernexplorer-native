export const m20261009: string[] = [
	`create table "weather_warning_cache" ("id" uuid not null, "lat" double precision not null, "lon" double precision not null, "warning_data" json not null, "expires_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
	`create index "idx_weather_warning_cache_expires_at" on "weather_warning_cache" ("expires_at");`,
	`create index "idx_weather_warning_cache_updated_at" on "weather_warning_cache" ("updated_at");`,
];
