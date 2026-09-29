export const m20260928: string[] = [
	`alter table "point_of_interest" drop constraint "point_of_interest_conditions_check";`,
	`alter table "point_of_interest" add constraint "point_of_interest_conditions_check" check ("conditions" <@ array['ROUGH_ROAD'::text, 'LIMITED_PARKING'::text, 'BRIDGE_OUT'::text, 'STEEP_CLIMB'::text, 'LOOSE_ROCK'::text, 'FLOODED_HIGH_WATER'::text, 'WATER_CROSSING'::text, 'FALLEN_TREES'::text, 'OVERGROWN'::text, 'MUD'::text, 'BEAR_ACTIVITY'::text, 'TICKS'::text, 'MOSQUITOES'::text, 'POISONOUS_PLANTS'::text, 'ICE'::text, 'SNOW'::text, 'DUST'::text, 'NO_CELL_SERVICE'::text, 'GARBAGE'::text, 'PARK PASS_REQUIRED'::text]);`,

	`alter table "review" drop constraint "review_conditions_check";`,
	`alter table "review" add constraint "review_conditions_check" check ("conditions" <@ array['ROUGH_ROAD'::text, 'LIMITED_PARKING'::text, 'BRIDGE_OUT'::text, 'STEEP_CLIMB'::text, 'LOOSE_ROCK'::text, 'FLOODED_HIGH_WATER'::text, 'WATER_CROSSING'::text, 'FALLEN_TREES'::text, 'OVERGROWN'::text, 'MUD'::text, 'BEAR_ACTIVITY'::text, 'TICKS'::text, 'MOSQUITOES'::text, 'POISONOUS_PLANTS'::text, 'ICE'::text, 'SNOW'::text, 'DUST'::text, 'NO_CELL_SERVICE'::text, 'GARBAGE'::text, 'PARK PASS_REQUIRED'::text]);`,
];
