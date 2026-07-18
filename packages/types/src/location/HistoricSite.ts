import {RegionType} from './Region';
import {countrySummary} from './Country';
export type HistoricSiteType = {
	id: number;
	name: string;
	description: string;
	image: string;
	lat: number;
	lon: number;
	country: countrySummary;
	region: RegionType;
	startDate?: number | null;
	endDate?: number | null;
};

export type HistoricSiteSummaryType = {
	id: number;
	name: string;
	description: string;
	image: string;
	country: string;
	region: string;
	lat: number;
	lon: number;
	startDate: number | null;
	endDate: number | null;
};
