export const m20261111: string[] = [
	`insert into "article_category" ("id", "name", "parent_id")
		values (md5('News')::uuid, 'News', null)
		on conflict ("name") where "parent_id" is null do nothing;`,
];
