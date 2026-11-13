export const m20261113b: string[] = [
	`insert into "article" (
		"id", "version", "content", "title", "url", "category_id", "author_id", "created_at", "updated_at"
	)
	select
		md5('support:difficulty-levels')::uuid,
		1,
		$$# Understanding Difficulty Levels

Difficulty labels are broad guides to the kind of effort and access to expect. They are not a guarantee of conditions or a substitute for planning your trip.

## Developed

Developed describes a site with more established access or infrastructure. It does not guarantee that services are available or that a route is maintained.

- **Developed Easy:** A straightforward approach, access from a parking lot, or very short trail.
- **Developed Medium:** A longer trail, uneven ground, or a moderate increase in effort.
- **Developed Hard:** Expect a more strenuous outing; steep, rough, or otherwise challenging sections may be present.
- **Developed Multi-Day:** Plan for an outing that takes more than one day, including overnight arrangements. Multi-Day describes duration, not a specific technical difficulty grade.

## Remote

Remote describes a site where access is isolated and nearby services or infrastructure are limited. Even an easier-rated remote outing calls for independent preparation.

- **Remote Easy:** A relatively straightforward approach for a remote setting; short distance from a maintained access point.
- **Remote Medium:** May require more physical effort or route-finding, with remote conditions adding planning considerations.
- **Remote Hard:** A demanding remote outing that may involve strenuous travel, difficult route-finding, or challenging terrain.
- **Remote Multi-Day:** A multi-day trip in a remote setting. Plan for overnight needs, supplies, navigation, communication, and changing conditions.

Ratings are general and conditions can change with weather, season, access, and other factors. Check current site information and local guidance, bring appropriate equipment, and choose an outing that matches your experience and capabilities.$$,
		'Understanding Difficulty Levels',
		'difficulty-levels',
		support_category."id",
		author."id",
		now(),
		now()
	from "article_category" as support_category
	join "user" as author on author."id" = '00000000-0000-0000-0000-000000000000'::uuid
	where support_category."name" = 'Support'
		and support_category."parent_id" is null
		and not exists (
			select 1 from "article" as existing
			where existing."url" = 'difficulty-levels'
				and existing."category_id" = support_category."id"
		)
	on conflict ("id") do nothing;`,
];
