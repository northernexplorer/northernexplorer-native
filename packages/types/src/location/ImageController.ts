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
	uri: string;
	filename: string;
	mimeType: string;
	size?: number;
	altText?: string;
}

export const ImageController = {
	upload: {
		params: {},
		body: {} as {
			pointOfInterestId: string;
			files: UploadImageFileInput[];
		},
		response: null as unknown as {
			success: boolean;
			message: string;
			images: ImageType[];
		},
	},
	deleteById: {
		params: {} as {id: string},
		response: null as unknown as {
			success: boolean;
			message: string;
		},
	},
	like: {
		params: {} as {id: string},
		response: null as unknown as {
			success: boolean;
			likes: number;
		},
	},
	updateStatus: {
		params: {} as {id: string},
		body: {} as {status: ImageStatusEnum},
		response: null as unknown as {
			success: boolean;
			image: ImageType;
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
