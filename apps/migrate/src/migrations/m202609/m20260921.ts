export const m20260921: string[] = [
	`alter table "image" alter column "point_of_interest_id" drop not null;`,

	// Add the three default images because the image table is currently empty.
	`insert into "image" (
		id,
		version,
		url,
		file_extension,
		filename,
		mime_type,
		size,
		processed,
		point_of_interest_id,
		user_id,
		created_at,
		status,
		hash,
		can_be_cover
	) values
	(
		'649e4c19-44fb-4717-b40d-703a70850c92',
		1,
		'https://thedatadropofff.sfo3.cdn.digitaloceanspaces.com/defaults/cave.png',
		'png',
		'cave',
		'image/png',
		0,
		true,
		null,
		'00000000-0000-0000-0000-000000000000',
		now(),
		'Approved',
		'default-cave',
		false
	),
	(
		'c82b2c06-366f-4449-a800-c991ef61d8db',
		1,
		'https://thedatadropofff.sfo3.cdn.digitaloceanspaces.com/defaults/historic-site.png',
		'png',
		'historic-site',
		'image/png',
		0,
		true,
		null,
		'00000000-0000-0000-0000-000000000000',
		now(),
		'Approved',
		'default-historic-site',
		false
	),
	(
		'f811f16a-79f4-40dc-9324-7de747376c78',
		1,
		'https://thedatadropofff.sfo3.cdn.digitaloceanspaces.com/defaults/waterfall.png',
		'png',
		'waterfall',
		'image/png',
		0,
		true,
		null,
		'00000000-0000-0000-0000-000000000000',
		now(),
		'Approved',
		'default-waterfall',
		false
	);`,

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
