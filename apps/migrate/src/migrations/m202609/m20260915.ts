export const m20260915: string[] = [
	`alter table "point_of_interest" add "entrance_cost" text null, add "conditions" text[] null, add "rating" smallint null, add "difficulty" text null;`,
	`alter table "point_of_interest" add constraint "point_of_interest_entrance_cost_check" check ("entrance_cost" in ('FREE', '1-10', '11-25', '26-50', '50+'));`,
	`alter table "point_of_interest" add constraint "point_of_interest_conditions_check" check ("conditions" <@ array['ROUGH_ROAD'::text, 'LIMITED_PARKING'::text, 'BRIDGE_OUT'::text, 'STEEP_CLIMB'::text, 'LOOSE_ROCK'::text, 'FLOODED_HIGH_WATER'::text, 'WATER_CROSSING'::text, 'FALLEN_TREES'::text, 'OVERGROWN'::text, 'MUD'::text, 'BEAR_ACTIVITY'::text, 'TICKS'::text, 'MOSQUITOES'::text, 'POISONOUS_PLANTS'::text, 'ICE'::text, 'SNOW'::text, 'DUST'::text, 'NO_CELL_SERVICE'::text, 'GARBAGE'::text]);`,
	`alter table "point_of_interest" add constraint "point_of_interest_difficulty_check" check ("difficulty" in ('EASY', 'MODERATE', 'HARD', 'EXTREME', 'IMPOSSIBLE'));`,
];
