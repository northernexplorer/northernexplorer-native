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

export const SupportController = {
	getByUrl: {
		params: {} as {url: string},
		response: null as unknown as SupportType,
	},
	getAll: {
		params: {} as Record<string, never>,
		response: null as unknown as SupportType[],
	},
};
