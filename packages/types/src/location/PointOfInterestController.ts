import {GenericResponseType} from '../GenericResponseType';
import {RegionType} from './RegionController';
import {CountryType} from './CountryController';
import {ReviewSummary} from './ReviewController';
import {OrganizationType} from './OrganizationController';
import {ImageType} from './ImageController';

export enum PublishStatusEnum {
	Published = 'Published',
	Draft = 'Draft',
}

export enum PointOfInterestTypeEnum {
	Cave = 'Cave',
	HistoricSite = 'HistoricSite',
	Waterfall = 'Waterfall',
}

export enum VisitedFilterEnum {
	All = 'All',
	Visited = 'Visited',
	Unvisited = 'Unvisited',
}

export type PointOfInterestType = {
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
	type: PointOfInterestTypeEnum[];
	organization: OrganizationType;
	averageRating?: number;
	images: ImageType[];
};

export type PointOfInterestEditType = {
	id: string;
	name: string;
	description: string;
	image: string;
	lat: number;
	lon: number;
	countryId: string;
	regionId: string;
	organizationId: string;
	startDate?: number;
	endDate?: number;
	status: PublishStatusEnum;
	type: PointOfInterestTypeEnum[];
};

export const PointOfInterestController = {
	getNearbyPointOfInterests: {
		params: {} as {lat: number; lon: number; limit: number; selectedPoiTypes?: PointOfInterestTypeEnum[]; visitedFilter?: VisitedFilterEnum},
		response: null as unknown as PointOfInterestType[],
	},
	getPointOfInterestById: {
		params: {} as {id: string},
		response: null as unknown as PointOfInterestType,
	},
	getDrafts: {
		params: {} as Record<string, undefined>,
		response: {} as PointOfInterestType[],
	},
	getPublished: {
		params: {} as Record<string, undefined>,
		response: {} as PointOfInterestType[],
	},
	edit: {
		params: {} as PointOfInterestEditType,
		response: {} as GenericResponseType,
	},
};
