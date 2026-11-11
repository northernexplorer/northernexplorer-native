export const m20261111b: string[] = [
	`insert into "article_category" ("id", "name", "parent_id")
		select md5('News:' || child."name")::uuid, child."name", parent."id"
		from "article_category" as parent
		cross join (values ('Expedition'), ('Update')) as child("name")
		where parent."name" = 'News' and parent."parent_id" is null
		on conflict ("parent_id", "name") where "parent_id" is not null do nothing;`,
	`insert into "article" (
		"id", "version", "content", "title", "url", "category_id", "author_id", "created_at", "updated_at"
	)
	select
		md5('news:northern-explorer-app-launch')::uuid,
		1,
		$$Northern Explorer Inc. today officially announced the launch of the Northern Explorer App, a new cross-platform mobile and web application built to help adventurers, historians, and outdoor enthusiasts discover and navigate Canada’s backcountry and historical landmarks.

Designed for seamless exploration both online and off-grid, the Northern Explorer App brings together thousands of geographic points of interest across Canada—including remote waterfalls, historic sites, and hidden caves. With interactive mapping layers, detailed location data, and offline caching capabilities, users can safely plan expeditions and explore remote terrain with confidence.

> “Our goal with Northern Explorer is to bridge historical preservation with backcountry discovery,” said Shayne Thiessen, President of Northern Explorer Inc. “Whether you’re tracing historical exploration routes, searching for unmapped waterfalls, or exploring local historic landmarks, Northern Explorer provides the tools and data to guide your journey.”

## Key Features of the Northern Explorer App:

- **Extensive Point-of-Interest Database:** Access mapping data for thousands of waterfalls, caves, and historic sites across Canada.
- **Offline Navigation & Caching:** Download maps and route data for seamless access in remote areas without cellular service.
- **Interactive Map Layers:** View detailed terrain, basemaps, and historical overlays tailored for wilderness exploration.
- **Cross-Platform Access:** Available on iOS, Android, and web at northernexplorer.org.

## Availability

The Northern Explorer App is available starting today on Android and web at northernexplorer.org. Release for IOS is coming within the next few weeks.

## About Northern Explorer Inc.

Northern Explorer Inc. is a Manitoba-based software company dedicated to building modern mobile and web technologies for geographical discovery, backcountry mapping, and historical preservation across Canada.$$,
		$$Northern Explorer Inc. Launches New Mobile & Web App to Map Canada’s Hidden Historic Sites, Waterfalls, and Caves$$,
		'northern-explorer-app-launch',
		update_category."id",
		author."id",
		now(),
		now()
	from "article_category" as update_category
	join "article_category" as news_category
		on news_category."id" = update_category."parent_id"
	join "user" as author on author."id" = '00000000-0000-0000-0000-000000000000'::uuid
	where update_category."name" = 'Update'
		and news_category."name" = 'News'
		and news_category."parent_id" is null
		and not exists (
			select 1 from "article" as existing
			where existing."url" = 'northern-explorer-app-launch'
				and existing."category_id" = update_category."id"
		)
	on conflict ("id") do nothing;`,
];
