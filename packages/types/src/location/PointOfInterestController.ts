import {GenericResponseType} from '../GenericResponseType';
import {RegionType} from './RegionController';
import {CountryType} from './CountryController';
import {EntranceCostEnum, ReviewRatingEnum, ReviewSummary, SiteConditionEnum, SiteDifficultyEnum} from './ReviewController';
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
	image: ImageType;
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
	image: ImageType;
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

export const PointOfInterestController = {
	getNearbyPointOfInterests: {
		params: {} as {
			lat: number;
			lon: number;
			limit: number;
			selectedPoiTypes?: PointOfInterestTypeEnum[];
			visitedFilter?: VisitedFilterEnum;
			minRating?: number | null;
			maxDifficultyIndex?: number;
			maxCostIndex?: number;
			showDrafts?: boolean;
		},
		response: null as unknown as PointOfInterestType[],
	},
	getPointOfInterestById: {
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
};
