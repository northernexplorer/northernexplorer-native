import {UserType} from '../user';

export enum SupportCategory {
	Legal = 'Legal',
	Help = 'Help',
}

export type SupportType = {
	id: string;
	version: number;
	content: string;
	title: string;
	url: string;
	createdAt: Date;
	updatedAt: Date;
	author: UserType;
	category: SupportCategory;
};

export type SupportHeadingType = {
	id: string;
	title: string;
	url: string;
	category: SupportCategory;
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
