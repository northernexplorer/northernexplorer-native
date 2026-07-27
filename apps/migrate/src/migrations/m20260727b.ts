export const m20260727b: string[] = [
	`create table "subscription_feature" ("id" uuid not null, "label" text not null, primary key ("id"));`,
	`create table "subscription_level_features" ("subscription_level_id" uuid not null, "subscription_feature_id" uuid not null, primary key ("subscription_level_id", "subscription_feature_id"));`,
	`alter table "subscription_level_features" add constraint "subscription_level_features_subscription_level_id_foreign" foreign key ("subscription_level_id") references "subscription_level" ("id") on update cascade on delete cascade;`,
	`alter table "subscription_level_features" add constraint "subscription_level_features_subscription_feature_id_foreign" foreign key ("subscription_feature_id") references "subscription_feature" ("id") on update cascade on delete cascade;`,
];
