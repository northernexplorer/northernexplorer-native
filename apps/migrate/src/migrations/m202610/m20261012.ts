const NATIONAL_PARK_SERVICE_ORG_ID = 'e0000000-0000-4000-8000-000000000001';
const OTHER_ORG_ID = '5b47c519-02fa-49cb-af9d-ec4ee5db5abd';

const US_STATES = [
	{name: 'Alabama', orgName: 'Alabama State Parks', orgId: 'b0110001-0001-4001-8001-000000000001'},
	{name: 'Alaska', orgName: 'Alaska State Parks', orgId: 'b0110002-0002-4002-8002-000000000002'},
	{name: 'Arizona', orgName: 'Arizona State Parks & Trails', orgId: 'b0110003-0003-4003-8003-000000000003'},
	{name: 'Arkansas', orgName: 'Arkansas State Parks', orgId: 'b0110004-0004-4004-8004-000000000004'},
	{name: 'California', orgName: 'California State Parks', orgId: 'b0110005-0005-4005-8005-000000000005'},
	{name: 'Colorado', orgName: 'Colorado Parks and Wildlife', orgId: 'b0110006-0006-4006-8006-000000000006'},
	{name: 'Connecticut', orgName: 'Connecticut State Parks', orgId: 'b0110007-0007-4007-8007-000000000007'},
	{name: 'Delaware', orgName: 'Delaware State Parks', orgId: 'b0110008-0008-4008-8008-000000000008'},
	{name: 'Florida', orgName: 'Florida State Parks', orgId: 'b0110009-0009-4009-8009-000000000009'},
	{name: 'Georgia', orgName: 'Georgia State Parks & Historic Sites', orgId: 'b0110010-0010-4010-8010-000000000010'},
	{name: 'Hawaii', orgName: 'Hawaii State Parks', orgId: 'b0110011-0011-4011-8011-000000000011'},
	{name: 'Idaho', orgName: 'Idaho Department of Parks and Recreation', orgId: 'b0110012-0012-4012-8012-000000000012'},
	{name: 'Illinois', orgName: 'Illinois State Parks', orgId: 'b0110013-0013-4013-8013-000000000013'},
	{name: 'Indiana', orgName: 'Indiana State Parks', orgId: 'b0110014-0014-4014-8014-000000000014'},
	{name: 'Iowa', orgName: 'Iowa State Parks', orgId: 'b0110015-0015-4015-8015-000000000015'},
	{name: 'Kansas', orgName: 'Kansas Department of Wildlife and Parks', orgId: 'b0110016-0016-4016-8016-000000000016'},
	{name: 'Kentucky', orgName: 'Kentucky State Parks', orgId: 'b0110017-0017-4017-8017-000000000017'},
	{name: 'Louisiana', orgName: 'Louisiana State Parks', orgId: 'b0110018-0018-4018-8018-000000000018'},
	{name: 'Maine', orgName: 'Maine Bureau of Parks and Lands', orgId: 'b0110019-0019-4019-8019-000000000019'},
	{name: 'Maryland', orgName: 'Maryland Park Service', orgId: 'b0110020-0020-4020-8020-000000000020'},
	{name: 'Massachusetts', orgName: 'Massachusetts Department of Conservation and Recreation', orgId: 'b0110021-0021-4021-8021-000000000021'},
	{name: 'Michigan', orgName: 'Michigan State Parks', orgId: 'b0110022-0022-4022-8022-000000000022'},
	{name: 'Minnesota', orgName: 'Minnesota State Parks and Trails', orgId: 'b0110023-0023-4023-8023-000000000023'},
	{name: 'Mississippi', orgName: 'Mississippi State Parks', orgId: 'b0110024-0024-4024-8024-000000000024'},
	{name: 'Missouri', orgName: 'Missouri State Parks', orgId: 'b0110025-0025-4025-8025-000000000025'},
	{name: 'Montana', orgName: 'Montana State Parks', orgId: 'b0110026-0026-4026-8026-000000000026'},
	{name: 'Nebraska', orgName: 'Nebraska Game and Parks Commission', orgId: 'b0110027-0027-4027-8027-000000000027'},
	{name: 'Nevada', orgName: 'Nevada State Parks', orgId: 'b0110028-0028-4028-8028-000000000028'},
	{name: 'New Hampshire', orgName: 'New Hampshire State Parks', orgId: 'b0110029-0029-4029-8029-000000000029'},
	{name: 'New Jersey', orgName: 'New Jersey State Park Service', orgId: 'b0110030-0030-4030-8030-000000000030'},
	{name: 'New Mexico', orgName: 'New Mexico State Parks', orgId: 'b0110031-0031-4031-8031-000000000031'},
	{
		name: 'New York',
		orgName: 'New York State Office of Parks, Recreation and Historic Preservation',
		orgId: 'b0110032-0032-4032-8032-000000000032',
	},
	{name: 'North Carolina', orgName: 'North Carolina State Parks', orgId: 'b0110033-0033-4033-8033-000000000033'},
	{name: 'North Dakota', orgName: 'North Dakota Parks and Recreation', orgId: 'b0110034-0034-4034-8034-000000000034'},
	{name: 'Ohio', orgName: 'Ohio State Parks and Watercraft', orgId: 'b0110035-0035-4035-8035-000000000035'},
	{name: 'Oklahoma', orgName: 'Oklahoma State Parks', orgId: 'b0110036-0036-4036-8036-000000000036'},
	{name: 'Oregon', orgName: 'Oregon Parks and Recreation Department', orgId: 'b0110037-0037-4037-8037-000000000037'},
	{name: 'Pennsylvania', orgName: 'Pennsylvania State Parks', orgId: 'b0110038-0038-4038-8038-000000000038'},
	{name: 'Rhode Island', orgName: 'Rhode Island State Parks', orgId: 'b0110039-0039-4039-8039-000000000039'},
	{name: 'South Carolina', orgName: 'South Carolina State Parks', orgId: 'b0110040-0040-4040-8040-000000000040'},
	{name: 'South Dakota', orgName: 'South Dakota Game, Fish and Parks', orgId: 'b0110041-0041-4041-8041-000000000041'},
	{name: 'Tennessee', orgName: 'Tennessee State Parks', orgId: 'b0110042-0042-4042-8042-000000000042'},
	{name: 'Texas', orgName: 'Texas Parks and Wildlife Department', orgId: 'b0110043-0043-4043-8043-000000000043'},
	{name: 'Utah', orgName: 'Utah State Parks', orgId: 'b0110044-0044-4044-8044-000000000044'},
	{name: 'Vermont', orgName: 'Vermont State Parks', orgId: 'b0110045-0045-4045-8045-000000000045'},
	{name: 'Virginia', orgName: 'Virginia State Parks', orgId: 'b0110046-0046-4046-8046-000000000046'},
	{name: 'Washington', orgName: 'Washington State Parks and Recreation Commission', orgId: 'b0110047-0047-4047-8047-000000000047'},
	{name: 'West Virginia', orgName: 'West Virginia State Parks', orgId: 'b0110048-0048-4048-8048-000000000048'},
	{name: 'Wisconsin', orgName: 'Wisconsin State Parks', orgId: 'b0110049-0049-4049-8049-000000000049'},
	{name: 'Wyoming', orgName: 'Wyoming State Parks and Historic Sites', orgId: 'b0110050-0050-4050-8050-000000000050'},
];

export const m20261012: string[] = [
	// Add National Park Service organization
	`insert into "organization" ("id", "version", "name") values ('${NATIONAL_PARK_SERVICE_ORG_ID}', 1, 'National Park Service') on conflict ("id") do nothing;`,

	// Add state park organizations for each American state
	...US_STATES.map(
		state =>
			`insert into "organization" ("id", "version", "name") values ('${state.orgId}', 1, '${state.orgName}') on conflict ("id") do nothing;`,
	),

	// Link National Park Service to all American regions and territories
	`insert into "organization_regions" ("organization_id", "region_id")
select '${NATIONAL_PARK_SERVICE_ORG_ID}', "region"."id"
from "region"
inner join "country" on "country"."id" = "region"."country_id"
where lower("country"."name") in ('united states', 'united states of america', 'usa', 'us')
on conflict ("organization_id", "region_id") do nothing;`,

	// Link each state's park organization to its respective state region
	...US_STATES.map(
		state => `insert into "organization_regions" ("organization_id", "region_id")
select '${state.orgId}', "id" from "region" where lower("name") = '${state.name.toLowerCase()}'
on conflict ("organization_id", "region_id") do nothing;`,
	),

	// Link Other organization to all American regions and territories
	`insert into "organization_regions" ("organization_id", "region_id")
select '${OTHER_ORG_ID}', "region"."id"
from "region"
inner join "country" on "country"."id" = "region"."country_id"
where lower("country"."name") in ('united states', 'united states of america', 'usa', 'us')
on conflict ("organization_id", "region_id") do nothing;`,
];
