import {GenericResponseType} from '../GenericResponseType';
import {UserSummary} from '../user/UserController';
import {PointOfInterestTypeEnum} from './PointOfInterestController';
import {CountryType} from './CountryController';
import {RegionType} from './RegionController';
import {OrganizationType} from './OrganizationController';
import {ImageHeaderType} from './ImageController';

export enum SuggestionStatusEnum {
	Pending = 'Pending',
	Approved = 'Approved',
	Rejected = 'Rejected',
}

export type PointOfInterestSuggestionType = {
	id: string;
	pointOfInterest: {
		id: string;
		name: string;
		description: string;
		lat: number;
		lon: number;
		startDate?: number;
		endDate?: number;
		type: PointOfInterestTypeEnum[];
		country: CountryType;
		region: RegionType;
		organization: OrganizationType;
		image?: ImageHeaderType;
	};
	user: UserSummary;
	name: string;
	description: string;
	lat: number;
	lon: number;
	country: CountryType;
	region: RegionType;
	organization: OrganizationType;
	image?: ImageHeaderType;
	startDate?: number;
	endDate?: number;
	type: PointOfInterestTypeEnum[];
	status: SuggestionStatusEnum;
	createdAt: string | Date;
	updatedAt: string | Date;
};

export type PointOfInterestSuggestionCreateType = {
	pointOfInterestId: string;
	name: string;
	description: string;
	lat: number;
	lon: number;
	countryId: string;
	regionId: string;
	organizationId: string;
	type: PointOfInterestTypeEnum[];
	startDate?: number;
	endDate?: number;
};

export const PointOfInterestSuggestionController = {
	create: {
		params: {} as PointOfInterestSuggestionCreateType,
		response: {} as GenericResponseType,
	},
	getPending: {
		params: {} as {limit?: number; offset?: number},
		response: [] as PointOfInterestSuggestionType[],
	},
	getAll: {
		params: {} as {limit?: number; offset?: number; status?: SuggestionStatusEnum},
		response: [] as PointOfInterestSuggestionType[],
	},
	getById: {
		params: {} as {id: string},
		response: {} as PointOfInterestSuggestionType,
	},
	approve: {
		params: {} as {id: string},
		response: {} as GenericResponseType,
	},
	reject: {
		params: {} as {id: string},
		response: {} as GenericResponseType,
	},
};
