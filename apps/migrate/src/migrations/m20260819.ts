export const m20260819: string[] = [
	`UPDATE point_of_interest
	 SET image = REPLACE(image, '/images/historic-sites/default.png', '/images/defaults/historic-site.png')
	 WHERE image LIKE '%/images/historic-sites/default.png%';`,
];
