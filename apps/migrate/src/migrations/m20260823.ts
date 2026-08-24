export const m20260823: string[] = [
	`insert into "subscription_feature" ("id", "label") values (gen_random_uuid(), 'Flashlight Widget');`,
	`insert into "subscription_level_features" ("subscription_level_id", "subscription_feature_id") select sl."id", sf."id" from "subscription_level" sl cross join "subscription_feature" sf where sf."label" = 'Flashlight Widget' and sl."cost" != 0;`,
];
