const PARKS_CANADA_ORG_ID = '3f68a2bc-8418-4221-9a74-b7cb7d10e11a';

export const m20260818: string[] = [
	`create table "organization" ("id" uuid not null, "version" int not null default 1, "name" text not null, primary key ("id"));`,

	`insert into "organization" ("id", "version", "name") values ('${PARKS_CANADA_ORG_ID}', 1, 'Parks Canada');`,

	`alter table "point_of_interest" add "organization_id" uuid;`,

	`update "point_of_interest" set "organization_id" = '${PARKS_CANADA_ORG_ID}' where "organization_id" is null;`,

	`alter table "point_of_interest" alter column "organization_id" set not null;`,
	`alter table "point_of_interest" add constraint "point_of_interest_organization_id_foreign" foreign key ("organization_id") references "organization" ("id");`,

	`alter table "user" alter column "birthday" set not null;`,
	`alter table "user" alter column "gender" set not null;`,

	`INSERT INTO "organization" ("id", "version", "name") VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'Alberta Parks');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('b1fec001-8d1c-4ef9-cc7e-7cc0ce491b22', 1, 'BC Parks');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('c2afd112-9e2d-4fa0-dd8f-8dd1df5a2c33', 1, 'Manitoba Parks');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('d3b0e223-0f3e-4fb1-ee90-9ee2ea6b3d44', 1, 'New Brunswick Provincial Parks');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('e4c1f334-104f-4fc2-ff01-0ff3fb7c4e55', 1, 'Newfoundland and Labrador Parks and Natural Areas');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('f5d20445-2150-4fd3-0012-1004ac8d5f66', 1, 'Nova Scotia Provincial Parks');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('06e31556-3261-4fe4-1123-2115bd9e6077', 1, 'Ontario Parks');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('17f42667-4372-4ff5-2234-3226ceaf7188', 1, 'Prince Edward Island Provincial Parks');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('28053778-5483-4006-3345-4337dfba8299', 1, 'Société des établissements de plein air du Québec');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('39164889-6594-4117-4456-5448eccb93aa', 1, 'SaskParks');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('4a27599a-76a5-4228-5567-6559fddca4bb', 1, 'NWT Parks');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('5b386aab-87b6-4339-6678-7660aeedb5cc', 1, 'Nunavut Parks and Special Places');`,
	`INSERT INTO "organization" ("id", "version", "name") VALUES ('6c497bbc-98c7-444a-7789-8771bffee6dd', 1, 'Yukon Parks');`,
];
