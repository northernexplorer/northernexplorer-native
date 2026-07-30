import {RegionType} from './RegionController';
import {CountryType} from './CountryController';
import { ReviewSummary } from '../features';



export type HistoricSiteType = {
	id: string;
	name: string;
	description: string;
	image: string;
	lat: number;
	lon: number;
	country?: CountryType;
	reviews?:ReviewSummary[];
	region?: RegionType;
	startDate?: number | null;
	endDate?: number | null;
};

export const HistoricSiteController = {
	getNearbyHistoricSites: {
		params: {} as {lat: number; lon: number; limit: number},
		response: null as unknown as HistoricSiteType[],
	},
	getHistoricSiteById: {
		params: {} as {id: string},
		response: null as unknown as HistoricSiteType,
	},
};
