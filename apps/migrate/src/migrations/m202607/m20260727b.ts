export const m20260727b: string[] = [
	`create table "subscription_feature" ("id" uuid not null, "label" text not null, primary key ("id"));`,
	`create table "subscription_level_features" ("subscription_level_id" uuid not null, "subscription_feature_id" uuid not null, primary key ("subscription_level_id", "subscription_feature_id"));`,
	`alter table "subscription_level_features" add constraint "subscription_level_features_subscription_level_id_foreign" foreign key ("subscription_level_id") references "subscription_level" ("id") on update cascade on delete cascade;`,
	`alter table "subscription_level_features" add constraint "subscription_level_features_subscription_feature_id_foreign" foreign key ("subscription_feature_id") references "subscription_feature" ("id") on update cascade on delete cascade;`,

	// 1. Drop description and rename short_description -> description
	`alter table "subscription_level" drop column "description";`,
	`alter table "subscription_level" rename column "short_description" to "description";`,

	// 2. Update Pathfinder description
	`update "subscription_level" set "description" = 'Advanced planning and navigation' where lower("name") = 'pathfinder';`,

	// 3. Insert 'Find Historic Sites' and associate with ALL subscription levels
	`insert into "subscription_feature" ("id", "label") values (gen_random_uuid(), 'Find Historic Sites');`,
	`insert into "subscription_level_features" ("subscription_level_id", "subscription_feature_id") select sl."id", sf."id" from "subscription_level" sl cross join "subscription_feature" sf where sf."label" = 'Find Historic Sites';`,

	// 4. Insert 'Map Base Layers (Satellite, Terrain)' and associate with NON-FREE levels
	`insert into "subscription_feature" ("id", "label") values (gen_random_uuid(), 'Map Base Layers (Satellite, Terrain)');`,
	`insert into "subscription_level_features" ("subscription_level_id", "subscription_feature_id") select sl."id", sf."id" from "subscription_level" sl cross join "subscription_feature" sf where sf."label" = 'Map Base Layers (Satellite, Terrain)' and sl."cost" != 0;`,

	// 5. Insert 'Compass Heading' and associate with NON-FREE levels
	`insert into "subscription_feature" ("id", "label") values (gen_random_uuid(), 'Compass Widget');`,
	`insert into "subscription_level_features" ("subscription_level_id", "subscription_feature_id") select sl."id", sf."id" from "subscription_level" sl cross join "subscription_feature" sf where sf."label" = 'Compass Widget' and sl."cost" != 0;`,

	`update "subscription_level" set "name" = 'Core', "description" = 'Basic features, free forever' where lower("name") = 'basic';`,
];
