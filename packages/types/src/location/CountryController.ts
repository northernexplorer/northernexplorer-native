export type CountryType = {
	id: string;
	name: string;
};

export type CountryCreateType = {
	name: string;
};

export type CountryEditType = {
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
	create: {
		params: {} as CountryCreateType,
		response: null as unknown as CountryType,
	},
	edit: {
		params: {} as CountryEditType,
		response: null as unknown as CountryType,
	},
};
