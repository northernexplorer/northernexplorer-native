export const m20260619: string[] = [
    `create table "city_cache" ("id" serial primary key, "lat" decimal(10,6) not null, "lon" decimal(10,6) not null, "city_data" text not null, "updated_at" timestamp not null default CURRENT_TIMESTAMP);`,
    `create index "idx_city_location" on "city_cache" ("lat", "lon");`,

    `create table "forecast_cache" ("id" serial primary key, "lat" decimal(10,6) not null, "lon" decimal(10,6) not null, "forecast_data" text not null, "updated_at" timestamp not null default CURRENT_TIMESTAMP);`,
    `create index "idx_forecast_location" on "forecast_cache" ("lat", "lon");`,

    `create table "historic_site" ("id" serial primary key, "name" varchar(255) not null, "description" text not null, "image" text not null, "lat" decimal(10,6) not null, "lon" decimal(10,6) not null, "country" varchar(100) null, "region" varchar(100) null,"created_at" timestamp not null default CURRENT_TIMESTAMP, "updated_at" timestamp not null default CURRENT_TIMESTAMP);`,
    `alter table "historic_site" add constraint "historic_site_name_unique" unique ("name");`,

    `create index "idx_site_location" on "historic_site" ("lat", "lon");`,

    `create table "weather_cache" ("id" serial primary key, "lat" decimal(10,6) not null, "lon" decimal(10,6) not null, "weather_data" text not null, "updated_at" timestamp not null default CURRENT_TIMESTAMP);`,
    `create index "idx_location" on "weather_cache" ("lat", "lon");`,
];
