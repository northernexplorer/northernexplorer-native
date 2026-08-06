import {CountryType} from './CountryController';

export type RegionType = {
	id: string;
	name: string;
	country?: CountryType;
	countryId?: string;
};

export const RegionController = {
	getRegionById: {
		params: {} as {id: string},
		response: null as unknown as RegionType,
	},
	getByCountryId: {
		params: {} as {id: string},
		response: null as unknown as RegionType[],
	},
};
