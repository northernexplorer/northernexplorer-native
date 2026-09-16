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
	likes: number;
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
	DEVELOPED = 'DEVELOPED', // Level 1: Roadside, paved walkways, maintained amenities
	LIGHT_HIKE = 'LIGHT_HIKE', // Level 2: Short footpaths under 5 km, mild terrain
	MODERATE_TRAIL = 'MODERATE_TRAIL', // Level 3: Backcountry trails 5+ km, sustained inclines
	OFF_TRAIL_REMOTE = 'OFF_TRAIL_REMOTE', // Level 4: Bushwhacking, GPS route-finding, watercraft required
	EXPEDITION_ONLY = 'EXPEDITION_ONLY', // Level 5: Multi-day backcountry travel, floatplane/charter required
}

export enum EntranceCostEnum {
	FREE = 'FREE',
	TIER_1_10 = '1-10',
	TIER_11_25 = '11-25',
	TIER_26_50 = '26-50',
	TIER_50_PLUS = '50+',
}

export enum SiteConditionEnum {
	// Access & Road Conditions
	ROUGH_ROAD = 'ROUGH_ROAD',
	LIMITED_PARKING = 'LIMITED_PARKING',
	BRIDGE_OUT = 'BRIDGE_OUT',
	STEEP_CLIMB = 'STEEP_CLIMB',
	LOOSE_ROCK = 'LOOSE_ROCK',

	// Water & Trail Obstacles
	FLOODED_HIGH_WATER = 'FLOODED_HIGH_WATER',
	WATER_CROSSING = 'WATER_CROSSING',
	FALLEN_TREES = 'FALLEN_TREES',
	OVERGROWN = 'OVERGROWN',
	MUD = 'MUD',

	// Wildlife & Natural Hazards
	BEAR_ACTIVITY = 'BEAR_ACTIVITY',
	TICKS = 'TICKS',
	MOSQUITOES = 'MOSQUITOES',
	POISONOUS_PLANTS = 'POISONOUS_PLANTS',

	// Weather & Seasonal Conditions
	ICE = 'ICE',
	SNOW = 'SNOW',
	DUST = 'DUST',

	// General & Site Utility
	NO_CELL_SERVICE = 'NO_CELL_SERVICE',
	GARBAGE = 'GARBAGE',
}

export const ReviewController = {
	getReviewById: {
		params: {} as {id: string},
		response: null as unknown as ReviewType,
	},
	getPendingReviews: {
		params: {} as {limit?: number; offset?: number},
		response: null as unknown as ReviewType[],
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
