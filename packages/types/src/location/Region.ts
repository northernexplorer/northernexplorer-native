import {CountryType} from './Country';

export type RegionType = {
	id: string;
	name: string;
	country?: CountryType;
	countryId?: string;
};
