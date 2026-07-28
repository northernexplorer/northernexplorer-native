import {SubscriptionFeature} from './SubscriptionFeatureController';

export type SubscriptionLevelsResponse = {
	id: string;
	version: number;
	name: string;
	enabled: boolean;
	cost: number;
	description: string;
	googleProductId?: string | null;
	features: SubscriptionFeature[];
};

export const SubscriptionLevelController = {
	getSubscriptionLevels: {
		params: {} as Record<string, never>,
		response: {} as SubscriptionLevelsResponse[],
	},
};
