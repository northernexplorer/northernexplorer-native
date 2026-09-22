export const m20260916: string[] = [
	// 1. Temporarily drop the old constraints so we can modify the data freely
	`alter table "point_of_interest" drop constraint if exists "point_of_interest_difficulty_check"`,
	`alter table "review" drop constraint if exists "review_difficulty_check"`,

	// 2. Map old Point of Interest difficulties to the new 5-level system
	`update "point_of_interest" set "difficulty" = 'DEVELOPED' where "difficulty" = 'EASY'`,
	`update "point_of_interest" set "difficulty" = 'MODERATE_TRAIL' where "difficulty" = 'MODERATE'`,
	`update "point_of_interest" set "difficulty" = 'OFF_TRAIL_REMOTE' where "difficulty" = 'HARD'`,
	`update "point_of_interest" set "difficulty" = 'EXPEDITION_ONLY' where "difficulty" in ('EXTREME', 'IMPOSSIBLE')`,

	// 3. Map old Review difficulties to the new system
	`update "review" set "difficulty" = 'DEVELOPED' where "difficulty" = 'EASY'`,
	`update "review" set "difficulty" = 'MODERATE_TRAIL' where "difficulty" = 'MODERATE'`,
	`update "review" set "difficulty" = 'OFF_TRAIL_REMOTE' where "difficulty" = 'HARD'`,
	`update "review" set "difficulty" = 'EXPEDITION_ONLY' where "difficulty" in ('EXTREME', 'IMPOSSIBLE')`,

	// 4. Apply the new check constraints
	`alter table "point_of_interest" add constraint "point_of_interest_difficulty_check" check ("difficulty" in ('DEVELOPED', 'LIGHT_HIKE', 'MODERATE_TRAIL', 'OFF_TRAIL_REMOTE', 'EXPEDITION_ONLY'))`,
	`alter table "review" add constraint "review_difficulty_check" check ("difficulty" in ('DEVELOPED', 'LIGHT_HIKE', 'MODERATE_TRAIL', 'OFF_TRAIL_REMOTE', 'EXPEDITION_ONLY'))`,
];
