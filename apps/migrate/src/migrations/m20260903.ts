export const m20260903: string[] = [
	`TRUNCATE TABLE "review" RESTART IDENTITY CASCADE;`,
	`ALTER TABLE "review" ADD "difficulty" text NOT NULL, ADD "entrance_cost" text NOT NULL, ADD "conditions" text[] NOT NULL DEFAULT '{}';`,
	`ALTER TABLE "review" ADD CONSTRAINT "review_difficulty_check" CHECK ("difficulty" IN ('EASY', 'MODERATE', 'HARD', 'EXTREME', 'IMPOSSIBLE'));`,
	`ALTER TABLE "review" ADD CONSTRAINT "review_entrance_cost_check" CHECK ("entrance_cost" IN ('FREE', '1-10', '11-25', '26-50', '50+'));`,
	`ALTER TABLE "review" ADD CONSTRAINT "review_conditions_check" CHECK ("conditions" <@ ARRAY['MUD'::text, 'BUGS'::text, 'DUST'::text, 'SNOW'::text, 'ICE'::text, 'FALLEN_TREES'::text, 'OVERGROWN'::text, 'GARBAGE'::text, 'POISONOUS_PLANTS'::text, 'FLOODED_HIGH_WATER'::text, 'WASHED_OUT_ROAD'::text, 'STEEP_CLIMB'::text, 'LOOSE_ROCK'::text, 'LIMITED_PARKING'::text, 'NO_CELL_SERVICE'::text, 'WATER_CROSSING'::text, 'BEAR_ACTIVITY'::text, 'ROUGH_ROAD'::text, 'TICKS'::text, 'BRIDGE_OUT'::text]);`,
];
