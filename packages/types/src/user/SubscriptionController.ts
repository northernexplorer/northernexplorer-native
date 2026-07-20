import {GenericResponseType} from '../GenericResponseType';

type SubscriptionParams = {username: string};

type SubscriptionResponse = {
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

type ChangeSubscriptionParams = {
	username: string;
	subscriptionLevelId: string;
};

export const SubscriptionController = {
	getByUsername: {
		params: {} as SubscriptionParams,
		response: {} as SubscriptionResponse,
	},
	changeSubscription: {
		params: {} as ChangeSubscriptionParams,
		response: {} as GenericResponseType,
	},
};
