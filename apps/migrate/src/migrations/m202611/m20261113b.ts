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

- **Developed Easy:** Roadside access, paved walkways, or maintained amenities.
- **Developed Medium:** Maintained short footpaths under 5 km, with mild terrain and basic maintenance.
- **Developed Hard:** Backcountry trails of 5 km or more, with sustained inclines near developed areas.
- **Developed Multi-Day:** Extended stays or multi-day camping at developed park facilities.

## Remote

Remote describes a site where access is isolated and nearby services or infrastructure are limited. Even an easier-rated remote outing calls for independent preparation.

- **Remote Easy:** Short off-trail or lightly marked routes that require basic navigation.
- **Remote Medium:** Backcountry travel that may involve bushwhacking or require watercraft access.
- **Remote Hard:** Remote wilderness travel requiring GPS route-finding through challenging terrain.
- **Remote Multi-Day:** A multi-day backcountry expedition requiring floatplane or charter access, or travel into deep wilderness.

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
