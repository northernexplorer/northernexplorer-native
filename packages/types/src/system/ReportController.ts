import {UserSummary} from '../user';
import {ReviewType} from '../location/ReviewController';
import {ImageType} from '../location/ImageController';

export enum ReportTypeEnum {
	Review = 'Review',
	Image = 'Image',
}

export enum ReportReasonEnum {
	Spam = 'Spam',
	HateSpeech = 'HateSpeech',
	Inappropriate = 'Inappropriate',
	NotRelevant = 'NotRelevant',
	Other = 'Other',
}

export enum ReportStatusEnum {
	Pending = 'Pending',
	Resolved = 'Resolved',
	Dismissed = 'Dismissed',
}

export interface ReportType {
	id: string;
	version: number;
	type: ReportTypeEnum;
	reason: ReportReasonEnum;
	description?: string;
	status: ReportStatusEnum;
	user: UserSummary;
	review?: ReviewType;
	image?: ImageType;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export const ReportController = {
	create: {
		params: {} as {
			type: ReportTypeEnum;
			reason: ReportReasonEnum;
			description?: string;
			reviewId?: string;
			imageId?: string;
		},
		response: {} as {success: boolean; id: string},
	},
	getAll: {
		params: {} as {
			limit?: number;
			offset?: number;
			status?: ReportStatusEnum;
		},
		response: [] as ReportType[],
	},
	getById: {
		params: {} as {id: string},
		response: {} as ReportType,
	},
	resolve: {
		params: {} as {id: string; deleteContent?: boolean},
		response: {} as {success: boolean},
	},
	dismiss: {
		params: {} as {id: string},
		response: {} as {success: boolean},
	},
	deleteById: {
		params: {} as {id: string},
		response: {} as {success: boolean},
	},
};
