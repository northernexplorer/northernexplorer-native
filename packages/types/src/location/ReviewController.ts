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
	DEVELOPED_EASY = 'DEVELOPED_EASY', // Level 1: Roadside, paved walkways, maintained amenities
	DEVELOPED_MEDIUM = 'DEVELOPED_MEDIUM', // Level 2: Short footpaths under 5 km, mild terrain with basic maintenance
	DEVELOPED_HARD = 'DEVELOPED_HARD', // Level 3: Backcountry trails 5+ km, sustained inclines near developed zones
	DEVELOPED_MULTI_DAY = 'DEVELOPED_MULTI_DAY', // Level 4: Extended stays or multi-day camping within developed park facilities
	REMOTE_EASY = 'REMOTE_EASY', // Level 2-3: Short off-trail or lightly marked routes requiring basic navigation
	REMOTE_MEDIUM = 'REMOTE_MEDIUM', // Level 3: Backcountry travel, bushwhacking, or watercraft access required
	REMOTE_HARD = 'REMOTE_HARD', // Level 4: Remote wilderness, GPS route-finding, challenging terrain
	REMOTE_MULTI_DAY = 'REMOTE_MULTI_DAY', // Level 5: Multi-day backcountry expedition, floatplane/charter or deep wilderness access
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
	PARK_PASS_REQUIRED = 'PARK PASS_REQUIRED',
}

export const ReviewController = {
	getById: {
		params: {} as {id: string},
		response: null as unknown as ReviewType,
	},
	getPending: {
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
	approve: {
		params: {} as {id: string},
		response: null as unknown as ReviewType,
	},
	reject: {
		params: {} as {id: string},
		response: null as unknown as {success: boolean},
	},
	deleteById: {
		params: {} as {id: string},
		response: null as unknown as {success: boolean},
	},
	create: {
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
	edit: {
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
