import {UserSummary} from '../user';
import {PointOfInterestType} from './PointOfInterestController';

export enum ImageStatusEnum {
	Pending = 'Pending',
	Approved = 'Approved',
}

export interface ImageType {
	id: string;
	version: number;
	url: string;
	fileExtension: string;
	filename: string;
	mimeType: string;
	size: number;
	likes: number;
	altText?: string;
	processed: boolean;
	pointOfInterest?: PointOfInterestType | string;
	user: UserSummary;
	createdAt: string | Date;
	status: ImageStatusEnum;
}

export interface UploadImageFileInput {
	filename: string;
	fileExtension: string;
	mimeType: string;
	size: number;
}

export const ImageController = {
	upload: {
		params: {} as {
			pointOfInterestId: string;
			files: UploadImageFileInput[];
		},
		response: null as unknown as {
			success: boolean;
		},
	},
	deleteById: {
		params: {} as {id: string},
		response: null as unknown as {
			success: boolean;
		},
	},
	like: {
		params: {} as {id: string},
		response: null as unknown as {
			success: boolean;
		},
	},
	updateStatus: {
		params: {} as {id: string; status: ImageStatusEnum},
		response: null as unknown as {
			success: boolean;
		},
	},
	getPending: {
		params: {},
		response: null as unknown as {
			images: ImageType[];
			total: number;
		},
	},
};
