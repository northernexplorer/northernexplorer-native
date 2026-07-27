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
		renewalDate?: Date | null;
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

type RevenueCatParams = {
	event?: {
		type?: string;
		app_user_id?: string;
		product_id?: string;
		expiration_at_ms?: number | string;
	};
	secret?: string;
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
	revenueCatUpgrade: {
		params: {} as RevenueCatParams,
		response: {} as GenericResponseType,
	},
};
