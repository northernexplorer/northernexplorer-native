import {UserType} from '../user';

export type SupportType = {
	id: string;
	version: number;
	content: string;
	title: string;
	url: string;
	createdAt: Date;
	updatedAt: Date;
	author: UserType;
};

export type SupportHeadingType = {
	id: string;
	title: string;
	url: string;
};

export const SupportController = {
	getByUrl: {
		params: {} as {url: string},
		response: null as unknown as SupportType,
	},
	getHeadings: {
		params: {} as Record<string, never>,
		response: null as unknown as SupportHeadingType[],
	},
};
