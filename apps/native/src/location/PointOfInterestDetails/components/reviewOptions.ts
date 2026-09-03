import {Ionicons} from '@expo/vector-icons';
import {EntranceCostEnum, ReviewRatingEnum, SiteConditionEnum, SiteDifficultyEnum} from '@northernexplorer/types';

export type IoniconsName = keyof typeof Ionicons.glyphMap;

export const formatEnumLabel = (str: string): string => {
	return str
		.toLowerCase()
		.split('_')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

export const RATING_MAPPING = [
	{rating: ReviewRatingEnum.TERRIBLE, label: 'Terrible'},
	{rating: ReviewRatingEnum.POOR, label: 'Poor'},
	{rating: ReviewRatingEnum.AVERAGE, label: 'Average'},
	{rating: ReviewRatingEnum.GOOD, label: 'Good'},
	{rating: ReviewRatingEnum.EXCELLENT, label: 'Excellent'},
];

export const DIFFICULTY_CONFIG: Record<SiteDifficultyEnum, {label: string; color: string; bgColor: string; borderColor: string}> = {
	[SiteDifficultyEnum.EASY]: {
		label: 'Easy',
		color: '#ffffff',
		bgColor: '#22c55e',
		borderColor: '#16a34a',
	},
	[SiteDifficultyEnum.MODERATE]: {
		label: 'Moderate',
		color: '#ffffff',
		bgColor: '#0ea5e9',
		borderColor: '#0284c7',
	},
	[SiteDifficultyEnum.HARD]: {
		label: 'Hard',
		color: '#ffffff',
		bgColor: '#eab308',
		borderColor: '#ca8a04',
	},
	[SiteDifficultyEnum.EXTREME]: {
		label: 'Extreme',
		color: '#ffffff',
		bgColor: '#f97316',
		borderColor: '#ea580c',
	},
	[SiteDifficultyEnum.IMPOSSIBLE]: {
		label: 'Impossible',
		color: '#ffffff',
		bgColor: '#ef4444',
		borderColor: '#dc2626',
	},
};

export const COST_LABEL_MAP: Record<EntranceCostEnum, {short: string; badge: string}> = {
	[EntranceCostEnum.FREE]: {short: 'Free', badge: 'Free Entrance'},
	[EntranceCostEnum.TIER_1_10]: {short: '$1–10', badge: '$1–10 Fee'},
	[EntranceCostEnum.TIER_11_25]: {short: '$11–25', badge: '$11–25 Fee'},
	[EntranceCostEnum.TIER_26_50]: {short: '$26–50', badge: '$26–50 Fee'},
	[EntranceCostEnum.TIER_50_PLUS]: {short: '$50+', badge: '$50+ Fee'},
};

export const CONDITION_ICON_MAP: Record<SiteConditionEnum, IoniconsName> = {
	[SiteConditionEnum.MUD]: 'water-outline',
	[SiteConditionEnum.BUGS]: 'bug-outline',
	[SiteConditionEnum.DUST]: 'cloud-outline',
	[SiteConditionEnum.SNOW]: 'snow-outline',
	[SiteConditionEnum.ICE]: 'bonfire-outline',
	[SiteConditionEnum.FALLEN_TREES]: 'leaf-outline',
	[SiteConditionEnum.OVERGROWN]: 'flower-outline',
	[SiteConditionEnum.GARBAGE]: 'trash-outline',
	[SiteConditionEnum.POISONOUS_PLANTS]: 'alert-circle-outline',
	[SiteConditionEnum.FLOODED_HIGH_WATER]: 'boat-outline',
	[SiteConditionEnum.WASHED_OUT_ROAD]: 'warning-outline',
	[SiteConditionEnum.STEEP_CLIMB]: 'trending-up-outline',
	[SiteConditionEnum.LOOSE_ROCK]: 'construct-outline',
	[SiteConditionEnum.LIMITED_PARKING]: 'car-outline',
	[SiteConditionEnum.NO_CELL_SERVICE]: 'cellular-outline',
	[SiteConditionEnum.WATER_CROSSING]: 'footsteps-outline',
	[SiteConditionEnum.BEAR_ACTIVITY]: 'paw-outline',
	[SiteConditionEnum.ROUGH_ROAD]: 'car-sport-outline',
	[SiteConditionEnum.TICKS]: 'bug-outline',
	[SiteConditionEnum.BRIDGE_OUT]: 'close-circle-outline',
};

export const DIFFICULTY_OPTIONS = Object.values(SiteDifficultyEnum).map(val => ({
	value: val,
	label: DIFFICULTY_CONFIG[val].label,
	bgColor: DIFFICULTY_CONFIG[val].bgColor,
	borderColor: DIFFICULTY_CONFIG[val].borderColor,
}));

export const COST_OPTIONS = Object.values(EntranceCostEnum).map(val => ({
	value: val,
	label: COST_LABEL_MAP[val].short,
}));

export const CONDITION_OPTIONS = Object.values(SiteConditionEnum).map(val => ({
	value: val,
	label: formatEnumLabel(val),
	icon: CONDITION_ICON_MAP[val],
}));
