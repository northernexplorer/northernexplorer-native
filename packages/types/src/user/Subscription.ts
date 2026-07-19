export type SubscriptionParams = {username: string};

export type SubscriptionResponse = {
	subscription: {
		id: string;
		version: number;
		startDate: Date;
		endDate: Date | null;
		renewalDate: Date;
	};
	subscriptionLevel: {
		id: string;
		version: number;
		name: string;
		enabled: boolean;
		cost: number;
		description: string;
	};
};

export type ChangeSubscriptionParams = {
	username: string;
	subscriptionLevelId: string;
};
