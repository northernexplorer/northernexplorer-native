import {RegionType} from './Region';

export type CountryType = {
	id: string;
	name: string;
	regions: RegionType[];
};

export type countrySummary = {
	id: string;
	name: string;
};
