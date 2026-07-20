export type LunarCycleType = {
	phase_fraction: number;
	moon_age_days: number;
	illumination_percentage: number;
	phase_name: string;
	is_waxing: boolean;
};

export const LunarController = {
	getLunarData: {
		params: {} as Record<string, never>,
		response: null as unknown as LunarCycleType,
	},
};
