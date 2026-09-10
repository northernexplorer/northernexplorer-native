import {UserSummary} from '../user';
import {PointOfInterestSummary} from './PointOfInterestController';

export enum ImageStatusEnum {
	Pending = 'Pending',
	Approved = 'Approved',
}

export enum ImageUploadStatus {
	Success = 'Success',
	Duplicate = 'Duplicate',
	Error = 'Error',
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
	pointOfInterest?: PointOfInterestSummary;
	user: UserSummary;
	createdAt: string | Date;
	status: ImageStatusEnum;
}

export interface UploadImageFileInput {
	filename: string;
	fileExtension: string;
	mimeType: string;
	size: number;
	uri: string;
}

export interface FileUpload {
	filename: string;
	fileExtension: string;
	mimeType: string;
	size: number;
	uri: string;
	base64: string;
}

export const ImageController = {
	upload: {
		params: {} as {
			pointOfInterestId: string;
			files: FileUpload[];
		},
		response: null as unknown as {
			file: string;
			status: ImageUploadStatus;
		}[],
	},
	deleteById: {
		params: {} as {id: string},
		response: null as unknown as {
			success: boolean;
		},
	},
	getById: {
		params: {} as {id: string},
		response: {} as unknown as ImageType,
	},
	like: {
		params: {} as {id: string},
		response: null as unknown as {
			success: boolean;
		},
	},
	unLike: {
		params: {} as {id: string},
		response: null as unknown as {
			success: boolean;
		},
	},
	hasLiked: {
		params: {} as {id: string},
		response: null as unknown as {
			liked: boolean;
			likeCount: number;
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
	topImages: {
		params: {},
		response: null as unknown as ImageType[],
	},
};
