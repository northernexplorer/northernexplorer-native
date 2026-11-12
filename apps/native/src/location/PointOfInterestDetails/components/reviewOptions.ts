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
	[SiteDifficultyEnum.DEVELOPED_EASY]: {
		label: 'Developed Easy',
		color: '#ffffff',
		bgColor: '#22c55e',
		borderColor: '#16a34a',
	},
	[SiteDifficultyEnum.DEVELOPED_MEDIUM]: {
		label: 'Developed Medium',
		color: '#ffffff',
		bgColor: '#0ea5e9',
		borderColor: '#0284c7',
	},
	[SiteDifficultyEnum.DEVELOPED_HARD]: {
		label: 'Developed Hard',
		color: '#ffffff',
		bgColor: '#eab308',
		borderColor: '#ca8a04',
	},
	[SiteDifficultyEnum.DEVELOPED_MULTI_DAY]: {
		label: 'Developed Multi-Day',
		color: '#ffffff',
		bgColor: '#a855f7',
		borderColor: '#9333ea',
	},
	[SiteDifficultyEnum.REMOTE_EASY]: {
		label: 'Remote Easy',
		color: '#ffffff',
		bgColor: '#f97316',
		borderColor: '#ea580c',
	},
	[SiteDifficultyEnum.REMOTE_MEDIUM]: {
		label: 'Remote Medium',
		color: '#ffffff',
		bgColor: '#ef4444',
		borderColor: '#dc2626',
	},
	[SiteDifficultyEnum.REMOTE_HARD]: {
		label: 'Remote Hard',
		color: '#ffffff',
		bgColor: '#dc2626',
		borderColor: '#b91c1c',
	},
	[SiteDifficultyEnum.REMOTE_MULTI_DAY]: {
		label: 'Remote Multi-Day',
		color: '#ffffff',
		bgColor: '#991b1b',
		borderColor: '#7f1d1d',
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
	[SiteConditionEnum.MOSQUITOES]: 'bug-outline',
	[SiteConditionEnum.DUST]: 'cloud-outline',
	[SiteConditionEnum.SNOW]: 'snow-outline',
	[SiteConditionEnum.ICE]: 'bonfire-outline',
	[SiteConditionEnum.FALLEN_TREES]: 'leaf-outline',
	[SiteConditionEnum.OVERGROWN]: 'flower-outline',
	[SiteConditionEnum.GARBAGE]: 'trash-outline',
	[SiteConditionEnum.POISONOUS_PLANTS]: 'alert-circle-outline',
	[SiteConditionEnum.FLOODED_HIGH_WATER]: 'boat-outline',
	[SiteConditionEnum.STEEP_CLIMB]: 'trending-up-outline',
	[SiteConditionEnum.LOOSE_ROCK]: 'construct-outline',
	[SiteConditionEnum.PARK_PASS_REQUIRED]: 'ticket-outline',
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

const DEVELOPED_DIFFICULTIES: SiteDifficultyEnum[] = [
	SiteDifficultyEnum.DEVELOPED_EASY,
	SiteDifficultyEnum.DEVELOPED_MEDIUM,
	SiteDifficultyEnum.DEVELOPED_HARD,
	SiteDifficultyEnum.DEVELOPED_MULTI_DAY,
];

const REMOTE_DIFFICULTIES: SiteDifficultyEnum[] = [
	SiteDifficultyEnum.REMOTE_EASY,
	SiteDifficultyEnum.REMOTE_MEDIUM,
	SiteDifficultyEnum.REMOTE_HARD,
	SiteDifficultyEnum.REMOTE_MULTI_DAY,
];

export const DIFFICULTY_GROUPS = [
	{label: 'Developed', options: DIFFICULTY_OPTIONS.filter(({value}) => DEVELOPED_DIFFICULTIES.includes(value))},
	{label: 'Remote', options: DIFFICULTY_OPTIONS.filter(({value}) => REMOTE_DIFFICULTIES.includes(value))},
];

export const COST_OPTIONS = Object.values(EntranceCostEnum).map(val => ({
	value: val,
	label: COST_LABEL_MAP[val].short,
}));

export const CONDITION_OPTIONS = Object.values(SiteConditionEnum).map(val => ({
	value: val,
	label: formatEnumLabel(val),
	icon: CONDITION_ICON_MAP[val],
}));
