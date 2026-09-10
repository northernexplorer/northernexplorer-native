export const m20260723: string[] = [
	`alter table "subscription_level" add "google_product_id" text null;`,
	`UPDATE "subscription_level" SET "google_product_id" = 'ne_explorer_pathfinder'  WHERE "name" = 'Pathfinder';`,
];
