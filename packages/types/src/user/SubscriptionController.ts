import {GenericResponseType} from '../GenericResponseType';

export type SubscriptionParams = {username: string};
export type PermissionResponse = {
	navigation: {
		useCompass: boolean;
		useFlashlight: boolean;
		useSignal: boolean;
		changeMapStyle: boolean;
		useOffTrailDifficulty: boolean;
		useExpeditionDifficulty: boolean;
	};
};

export type SubscriptionResponse = {
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
		response: null as unknown as PermissionResponse | null,
	},
	revenueCatUpgrade: {
		params: {} as RevenueCatParams,
		response: {} as GenericResponseType,
	},
};
