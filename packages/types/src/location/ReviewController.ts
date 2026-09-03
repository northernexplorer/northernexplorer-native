import {UserSummary} from '../user';

export enum ReviewStatusEnum {
	Pending = 'Pending',
	Approved = 'Approved',
}

export type ReviewType = {
	id: string;
	user: {
		id: string;
		username: string;
		firstName: string;
		lastName: string;
		score: number;
	};
	pointOfInterest: {id: string; name: string};
	rating: ReviewRatingEnum;
	difficulty: SiteDifficultyEnum;
	entranceCost: EntranceCostEnum;
	conditions: SiteConditionEnum[];
	description: string;
	status: ReviewStatusEnum;
};

export type ReviewSummary = {
	id: string;
	user: UserSummary;
	rating: ReviewRatingEnum;
	difficulty: SiteDifficultyEnum;
	entranceCost: EntranceCostEnum;
	conditions: SiteConditionEnum[];
	description: string;
	status: ReviewStatusEnum;
};

export enum ReviewRatingEnum {
	DEFAULT = 0,
	TERRIBLE = 1,
	POOR = 2,
	AVERAGE = 3,
	GOOD = 4,
	EXCELLENT = 5,
}

export enum SiteDifficultyEnum {
	EASY = 'EASY',
	MODERATE = 'MODERATE',
	HARD = 'HARD',
	EXTREME = 'EXTREME',
	IMPOSSIBLE = 'IMPOSSIBLE',
}

export enum EntranceCostEnum {
	FREE = 'FREE',
	TIER_1_10 = '1-10',
	TIER_11_25 = '11-25',
	TIER_26_50 = '26-50',
	TIER_50_PLUS = '50+',
}

export enum SiteConditionEnum {
	MUD = 'MUD',
	BUGS = 'BUGS',
	DUST = 'DUST',
	SNOW = 'SNOW',
	ICE = 'ICE',
	FALLEN_TREES = 'FALLEN_TREES',
	OVERGROWN = 'OVERGROWN',
	GARBAGE = 'GARBAGE',
	POISONOUS_PLANTS = 'POISONOUS_PLANTS',
	FLOODED_HIGH_WATER = 'FLOODED_HIGH_WATER',
	WASHED_OUT_ROAD = 'WASHED_OUT_ROAD',
	STEEP_CLIMB = 'STEEP_CLIMB',
	LOOSE_ROCK = 'LOOSE_ROCK',
	LIMITED_PARKING = 'LIMITED_PARKING',
	NO_CELL_SERVICE = 'NO_CELL_SERVICE',
	WATER_CROSSING = 'WATER_CROSSING',
	BEAR_ACTIVITY = 'BEAR_ACTIVITY',
	ROUGH_ROAD = 'ROUGH_ROAD',
	TICKS = 'TICKS',
	BRIDGE_OUT = 'BRIDGE_OUT',
}

export const ReviewController = {
	getReviewById: {
		params: {} as {id: string},
		response: null as unknown as ReviewType,
	},
	getPendingReviews: {
		params: {} as Record<string, never>,
		response: null as unknown as ReviewType[],
	},
	approveReview: {
		params: {} as {id: string},
		response: null as unknown as ReviewType,
	},
	rejectReview: {
		params: {} as {id: string},
		response: null as unknown as {success: boolean},
	},
	deleteReview: {
		params: {} as {id: string},
		response: null as unknown as {success: boolean},
	},
	createNewReview: {
		params: {} as {
			pointOfInterestId: string;
			rating: ReviewRatingEnum;
			difficulty: SiteDifficultyEnum;
			entranceCost: EntranceCostEnum;
			conditions: SiteConditionEnum[];
			description: string;
		},
		response: null as unknown as ReviewType,
	},
	editReview: {
		params: {} as {
			id: string;
			rating: ReviewRatingEnum;
			difficulty: SiteDifficultyEnum;
			entranceCost: EntranceCostEnum;
			conditions: SiteConditionEnum[];
			description: string;
		},
		response: null as unknown as ReviewType,
	},
};
