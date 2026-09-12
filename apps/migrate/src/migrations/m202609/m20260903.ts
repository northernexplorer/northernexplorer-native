export const m20260903: string[] = [
	`TRUNCATE TABLE "review" RESTART IDENTITY CASCADE;`,
	`ALTER TABLE "review" ADD "difficulty" text NOT NULL, ADD "entrance_cost" text NOT NULL, ADD "conditions" text[] NOT NULL;`,
	`ALTER TABLE "review" ADD CONSTRAINT "review_difficulty_check" CHECK ("difficulty" IN ('EASY', 'MODERATE', 'HARD', 'EXTREME', 'IMPOSSIBLE'));`,
	`ALTER TABLE "review" ADD CONSTRAINT "review_entrance_cost_check" CHECK ("entrance_cost" IN ('FREE', '1-10', '11-25', '26-50', '50+'));`,
	`alter table "review" add constraint "review_conditions_check" check ("conditions" <@ array['ROUGH_ROAD'::text, 'LIMITED_PARKING'::text, 'BRIDGE_OUT'::text, 'STEEP_CLIMB'::text, 'LOOSE_ROCK'::text, 'FLOODED_HIGH_WATER'::text, 'WATER_CROSSING'::text, 'FALLEN_TREES'::text, 'OVERGROWN'::text, 'MUD'::text, 'BEAR_ACTIVITY'::text, 'TICKS'::text, 'MOSQUITOES'::text, 'POISONOUS_PLANTS'::text, 'ICE'::text, 'SNOW'::text, 'DUST'::text, 'NO_CELL_SERVICE'::text, 'GARBAGE'::text]);`,
	`alter table "review" add "status" text not null;`,
	`alter table "review" add constraint "review_status_check" check ("status" in ('Pending', 'Approved'));`,
];
