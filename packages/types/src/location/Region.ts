import {CountryType} from './CountryController';

export type RegionType = {
	id: string;
	name: string;
	country?: CountryType;
	countryId?: string;
};
