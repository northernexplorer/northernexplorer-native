export const m20260921: string[] = [
	`alter table "image" alter column "point_of_interest_id" drop not null;`,

	`update "image" set "point_of_interest_id" = null where "id" in (
																	 'c82b2c06-366f-4449-a800-c991ef61d8db',
																	 '649e4c19-44fb-4717-b40d-703a70850c92',
																	 'f811f16a-79f4-40dc-9324-7de747376c78'
		);`,

	`alter table "point_of_interest" drop column "image";`,
	`alter table "point_of_interest" add "image_id" uuid null;`,
	`alter table "point_of_interest" add constraint "point_of_interest_image_id_foreign" foreign key ("image_id") references "image" ("id");`,

	`update "point_of_interest" set "image_id" = '649e4c19-44fb-4717-b40d-703a70850c92' where "type" @> array['Cave'];`,
	`update "point_of_interest" set "image_id" = 'c82b2c06-366f-4449-a800-c991ef61d8db' where "type" @> array['HistoricSite'];`,
	`update "point_of_interest" set "image_id" = 'f811f16a-79f4-40dc-9324-7de747376c78' where "type" @> array['Waterfall'];`,

	`alter table "point_of_interest" alter column "image_id" set not null;`,
];
