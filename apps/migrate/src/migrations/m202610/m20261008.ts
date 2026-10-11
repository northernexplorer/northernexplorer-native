const PARKS_CANADA_ORG_ID = '3f68a2bc-8418-4221-9a74-b7cb7d10e11a';
const OTHER_ORG_ID = '5b47c519-02fa-49cb-af9d-ec4ee5db5abd';

export const m20261008: string[] = [
	`insert into "organization" ("id", "version", "name") values ('${OTHER_ORG_ID}', 1, 'Other') on conflict ("id") do nothing;`,

	`create table "organization_regions" ("organization_id" uuid not null, "region_id" uuid not null, primary key ("organization_id", "region_id"));`,
	`alter table "organization_regions" add constraint "organization_regions_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`,
	`alter table "organization_regions" add constraint "organization_regions_region_id_foreign" foreign key ("region_id") references "region" ("id") on update cascade on delete cascade;`,

	// Link Parks Canada to Canadian regions and Other to all regions
	`insert into "organization_regions" ("organization_id", "region_id") select '${PARKS_CANADA_ORG_ID}', "region"."id" from "region" inner join "country" on "country"."id" = "region"."country_id" where lower("country"."name") = 'canada';`,
	`insert into "organization_regions" ("organization_id", "region_id") select '${OTHER_ORG_ID}', "id" from "region";`,

	// Link provincial and territorial park organizations to their respective regions
	`insert into "organization_regions" ("organization_id", "region_id") select 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', "id" from "region" where lower("name") = 'alberta';`,
	`insert into "organization_regions" ("organization_id", "region_id") select 'b1fec001-8d1c-4ef9-cc7e-7cc0ce491b22', "id" from "region" where lower("name") = 'british columbia';`,
	`insert into "organization_regions" ("organization_id", "region_id") select 'c2afd112-9e2d-4fa0-dd8f-8dd1df5a2c33', "id" from "region" where lower("name") = 'manitoba';`,
	`insert into "organization_regions" ("organization_id", "region_id") select 'd3b0e223-0f3e-4fb1-ee90-9ee2ea6b3d44', "id" from "region" where lower("name") = 'new brunswick';`,
	`insert into "organization_regions" ("organization_id", "region_id") select 'e4c1f334-104f-4fc2-ff01-0ff3fb7c4e55', "id" from "region" where lower("name") = 'newfoundland and labrador';`,
	`insert into "organization_regions" ("organization_id", "region_id") select 'f5d20445-2150-4fd3-0012-1004ac8d5f66', "id" from "region" where lower("name") = 'nova scotia';`,
	`insert into "organization_regions" ("organization_id", "region_id") select '06e31556-3261-4fe4-1123-2115bd9e6077', "id" from "region" where lower("name") = 'ontario';`,
	`insert into "organization_regions" ("organization_id", "region_id") select '17f42667-4372-4ff5-2234-3226ceaf7188', "id" from "region" where lower("name") = 'prince edward island';`,
	`insert into "organization_regions" ("organization_id", "region_id") select '28053778-5483-4006-3345-4337dfba8299', "id" from "region" where lower("name") = 'quebec';`,
	`insert into "organization_regions" ("organization_id", "region_id") select '39164889-6594-4117-4456-5448eccb93aa', "id" from "region" where lower("name") = 'saskatchewan';`,
	`insert into "organization_regions" ("organization_id", "region_id") select '4a27599a-76a5-4228-5567-6559fddca4bb', "id" from "region" where lower("name") = 'northwest territories';`,
	`insert into "organization_regions" ("organization_id", "region_id") select '5b386aab-87b6-4339-6678-7660aeedb5cc', "id" from "region" where lower("name") = 'nunavut';`,
	`insert into "organization_regions" ("organization_id", "region_id") select '6c497bbc-98c7-444a-7789-8771bffee6dd', "id" from "region" where lower("name") = 'yukon';`,
];
