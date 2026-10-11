import {CountryType} from './CountryController';

export type RegionType = {
	id: string;
	name: string;
	country?: CountryType;
	countryId?: string;
};

export type RegionCreateType = {
	name: string;
	countryId: string;
};

export type RegionEditType = {
	id: string;
	name: string;
	countryId: string;
};

export const RegionController = {
	getById: {
		params: {} as {id: string},
		response: null as unknown as RegionType,
	},
	getByCountryId: {
		params: {} as {id: string},
		response: null as unknown as RegionType[],
	},
	create: {
		params: {} as RegionCreateType,
		response: null as unknown as RegionType,
	},
	edit: {
		params: {} as RegionEditType,
		response: null as unknown as RegionType,
	},
};
