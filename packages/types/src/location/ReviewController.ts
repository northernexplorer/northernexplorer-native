import {UserSummary} from '../user';

export type ReviewType = {
	id: string;
	user: {
		id: string;
		username: string;
		score: number;
	};
	historicSite: {id: string; name: string};
	rating: ReviewRatingEnum;
	description: string;
};

export type ReviewSummary = {
	id: string;
	user: UserSummary;
	rating: ReviewRatingEnum;
	description: string;
};

export enum ReviewRatingEnum {
	TERRIBLE = 1,
	POOR = 2,
	AVERAGE = 3,
	GOOD = 4,
	EXCELLENT = 5,
}

export const ReviewController = {
	getReviewById: {
		params: {} as {id: string},
		response: null as unknown as ReviewType,
	},
	createNewReview: {
		params: {} as {
			userId: string;
			historicSiteId: string;
			rating: ReviewRatingEnum;
			description: string;
		},
		response: null as unknown as ReviewType,
	},
};
