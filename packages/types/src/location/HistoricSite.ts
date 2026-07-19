import {RegionType} from './Region';
import {CountryType} from './Country';

export type HistoricSiteType = {
	id: string;
	name: string;
	description: string;
	image: string;
	lat: number;
	lon: number;
	country?: CountryType;
	region?: RegionType;
	startDate?: number | null;
	endDate?: number | null;
};
