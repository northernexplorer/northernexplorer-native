export const m20260821: string[] = [
	// Historic Sites
	`UPDATE point_of_interest
     SET image = REPLACE(image, '/images/defaults/historic-site.png', '/uploads/defaults/historic-site.png')
     WHERE image LIKE '%/images/defaults/historic-site.png%';`,

	// Caves
	`UPDATE point_of_interest
     SET image = REPLACE(image, '/images/defaults/caves.png', '/uploads/defaults/caves.png')
     WHERE image LIKE '%/images/defaults/cave.png%';`,

	// Waterfalls
	`UPDATE point_of_interest
     SET image = REPLACE(image, '/images/defaults/waterfalls.png', '/uploads/defaults/waterfalls.png')
     WHERE image LIKE '%/images/defaults/waterfall.png%';`,
];
