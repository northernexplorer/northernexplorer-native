import {GenericResponseType} from '../GenericResponseType';

type SubscriptionParams = {username: string};
type GetPermissionParams = {username?: string};
type PermissionResponse = {
	map: {
		changeStyle: boolean;
	};
};

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
	getPermissions: {
		params: {} as GetPermissionParams,
		response: {} as PermissionResponse | null | undefined,
	},
	changeSubscription: {
		params: {} as ChangeSubscriptionParams,
		response: {} as GenericResponseType,
	},
};
