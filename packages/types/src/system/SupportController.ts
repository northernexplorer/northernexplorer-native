import {CaptchaResponseType, UserType} from '../user';

export enum ArticleCategory {
	Support = 'Support',
}

export enum ArticleSubcategory {
	Legal = 'Legal',
	Help = 'Help',
}

export type ArticleType = {
	id: string;
	version: number;
	content: string;
	title: string;
	url: string;
	createdAt: Date;
	updatedAt: Date;
	author: UserType;
	category: ArticleCategory;
	subcategory: ArticleSubcategory | null;
};

export type ArticleHeadingType = {
	id: string;
	title: string;
	url: string;
	category: ArticleCategory;
	subcategory: ArticleSubcategory | null;
};

export type ContactParams = {
	name: string;
	email: string;
	subject: string;
	message: string;
	captchaId: string;
	captchaAnswer: string;
	website?: string;
};

export const SupportController = {
	getByUrl: {
		params: {} as {url: string},
		response: null as unknown as ArticleType,
	},
	getHeadings: {
		params: {} as Record<string, never>,
		response: null as unknown as ArticleHeadingType[],
	},
	getCaptcha: {
		params: {} as Record<string, never>,
		response: null as unknown as CaptchaResponseType,
	},
	contact: {
		params: {} as ContactParams,
		response: null as unknown as {success: boolean},
	},
};
