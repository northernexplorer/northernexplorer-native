import {GenericResponseType} from '../GenericResponseType';
import {RegionType} from './RegionController';
import {CountryType} from './CountryController';
import {EntranceCostEnum, ReviewRatingEnum, ReviewSummary, SiteConditionEnum, SiteDifficultyEnum} from './ReviewController';
import {OrganizationType} from './OrganizationController';
import {ImageHeaderType, ImageType} from './ImageController';

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
	image: ImageHeaderType;
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
	entranceCost?: EntranceCostEnum;
	conditions?: SiteConditionEnum[];
	rating?: ReviewRatingEnum;
	difficulty?: SiteDifficultyEnum;
	images?: ImageType[];
};

export type PointOfInterestSummary = {
	id: string;
	name: string;
	description: string;
	image: ImageHeaderType;
	lat: number;
	lon: number;
	country: CountryType;
	region: RegionType;
	entranceCost?: EntranceCostEnum;
	conditions?: SiteConditionEnum[];
	rating?: ReviewRatingEnum;
	difficulty?: SiteDifficultyEnum;
};

export type PointOfInterestEditType = {
	id: string;
	name: string;
	description: string;
	imageId: string;
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

export type PointOfInterestCreateType = {
	name: string;
	description: string;
	lat: number;
	lon: number;
	countryId: string;
	regionId: string;
	organizationId: string;
	startDate?: number;
	endDate?: number;
	status?: PublishStatusEnum;
	type: PointOfInterestTypeEnum[];
};

export type PointOfInterestCreateResponseType = {
	success: boolean;
	countryName: string;
	regionName: string;
	id: string;
	poiName: string;
};

export const PointOfInterestController = {
	getNearby: {
		params: {} as {
			lat: number;
			lon: number;
			limit: number;
			selectedPoiTypes?: PointOfInterestTypeEnum[];
			visitedFilter?: VisitedFilterEnum;
			minRating?: number | null;
			maxDifficultyIndex?: number | null;
			maxCostIndex?: number;
			showDrafts?: boolean;
		},
		response: null as unknown as PointOfInterestType[],
	},
	getForMap: {
		params: {} as {
			lat: number;
			lon: number;
			limit: number;
			selectedPoiTypes?: PointOfInterestTypeEnum[];
			visitedFilter?: VisitedFilterEnum;
			minRating?: number | null;
			maxDifficultyIndex?: number | null;
			maxCostIndex?: number;
			showDrafts?: boolean;
		},
		response: null as unknown as PointOfInterestType[],
	},
	getById: {
		params: {} as {id: string},
		response: null as unknown as PointOfInterestType,
	},
	getDrafts: {
		params: {} as {limit?: number; offset?: number},
		response: {} as PointOfInterestType[],
	},
	getPublished: {
		params: {} as {limit?: number; offset?: number},
		response: {} as PointOfInterestType[],
	},
	edit: {
		params: {} as PointOfInterestEditType,
		response: {} as GenericResponseType,
	},
	create: {
		params: {} as PointOfInterestCreateType,
		response: {} as PointOfInterestCreateResponseType,
	},
};
