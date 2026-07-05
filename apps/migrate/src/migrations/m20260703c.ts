export const m20260703c: string[] = [
    `alter table "city_cache" alter column "updated_at" drop default;`,
    `alter table "forecast_cache" alter column "updated_at" drop default;`,
    `alter table "historic_site" alter column "created_at" drop default;`,
    `alter table "historic_site" alter column "updated_at" drop default;`,
    `alter table "migrations" alter column "executed_at" drop default;`,
    `alter table "weather_cache" alter column "updated_at" drop default;`,
];
