export type CountryType = {
	id: string;
	name: string;
};

export const CountryController = {
	getById: {
		params: {} as {id: string},
		response: null as unknown as CountryType,
	},
	getAll: {
		params: {} as Record<string, never>,
		response: null as unknown as CountryType[],
	},
};
