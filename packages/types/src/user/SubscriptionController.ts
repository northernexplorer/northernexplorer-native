import {GenericResponseType} from '../GenericResponseType';

type SubscriptionParams = {username: string};
type PermissionResponse = {
	navigation: {
		useCompass: boolean;
		changeMapStyle: boolean;
	};
	location: {
		editHistoricSite: boolean;
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
		params: {} as Record<string, never>,
		response: {} as PermissionResponse | null | undefined,
	},
	revenueCatUpgrade: {
		params: {} as RevenueCatParams,
		response: {} as GenericResponseType,
	},
};
