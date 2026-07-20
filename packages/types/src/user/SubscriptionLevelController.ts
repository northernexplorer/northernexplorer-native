export type SubscriptionLevelsResponse = {
	id: string;
	version: number;
	name: string;
	enabled: boolean;
	cost: number;
	description: string;
	shortDescription: string;
};

export const SubscriptionLevelController = {
	getSubscriptionLevels: {
		params: {} as Record<string, never>,
		response: {} as SubscriptionLevelsResponse[],
	},
};
