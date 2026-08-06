import {GenericResponseType} from '../GenericResponseType';
import {RegionType} from './RegionController';
import {CountryType} from './CountryController';
import {ReviewSummary} from './ReviewController';

export enum PublishStatusEnum {
	Published = 'Published',
	Draft = 'Draft',
}

export type HistoricSiteType = {
	id: string;
	name: string;
	description: string;
	image: string;
	lat: number;
	lon: number;
	country: CountryType;
	reviews?: ReviewSummary[];
	region: RegionType;
	startDate?: number;
	endDate?: number;
	status: PublishStatusEnum;
};

export type HistoricSiteEditType = {
	id: string;
	name: string;
	description: string;
	image: string;
	lat: number;
	lon: number;
	countryId: string;
	regionId: string;
	startDate?: number;
	endDate?: number;
	status: PublishStatusEnum;
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
	getDrafts: {
		params: {} as Record<string, undefined>,
		response: {} as HistoricSiteType[],
	},
	getPublished: {
		params: {} as Record<string, undefined>,
		response: {} as HistoricSiteType[],
	},
	edit: {
		params: {} as HistoricSiteEditType,
		response: {} as GenericResponseType,
	},
};
