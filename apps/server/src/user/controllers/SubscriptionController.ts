import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {PermissionService} from '../services/PermisionService';
import {AuthContext} from '../../index';
import {BaseController} from '../../core/BaseController';
import {SubscriptionLevel} from '../entities/SubscriptionLevel';
import {config} from '../../config';

type Route<M extends keyof ROUTES['user']['SubscriptionController']> = RouteDefinition<'user', 'SubscriptionController'>[M];

export class SubscriptionController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	private permissionService = new PermissionService();

	async getPermissions(params: Params<Route<'getPermissions'>>, auth?: AuthContext): Promise<Response<Route<'getPermissions'>>> {
		if (!params.username) return null;
		if (!auth?.userId) return null;
		const user = await this.repos.user.getByUsername(params.username);
		this.permissionService.canAccessProfile({
			userId: auth.userId,
			targetId: user.id,
		});

		const subscription = await this.repos.subscription.getById(user.subscription.id);
		const subscriptionLevel = await this.repos.subscriptionLevel.getById(subscription.subscriptionLevel.id);

		return {
			map: {
				changeStyle:
					subscriptionLevel.name === 'Explorer' ||
					subscriptionLevel.name === 'Trailblazer' ||
					subscriptionLevel.name === 'Pioneer' ||
					subscriptionLevel.name === 'Legend',
			},
		};
	}

	async getByUsername(params: Params<Route<'getByUsername'>>, auth?: AuthContext): Promise<Response<Route<'getByUsername'>>> {
		const user = await this.repos.user.getByUsername(params.username);
		this.permissionService.canAccessProfile({
			userId: auth?.userId,
			targetId: user.id,
		});

		const subscription = await this.repos.subscription.getById(user.subscription.id);
		const subscriptionLevel = await this.repos.subscriptionLevel.getById(subscription.subscriptionLevel.id);

		return {subscription, subscriptionLevel};
	}

	async revenueCatUpgrade(params: {
		event?: {
			type?: string;
			app_user_id?: string;
			product_id?: string;
			expiration_at_ms?: number;
		};
		secret?: string;
	}) {
		if (params.secret !== config.REVENUE_CAT_ACCESS_CODE) throw new Error('Unauthorized');
		const {event} = params;
		if (!event) throw new Error('Invalid webhook payload');

		const {type, app_user_id: username, product_id: productId, expiration_at_ms: expirationAtMs} = event;

		if (!username) throw new Error('Missing app_user_id in webhook event');

		const user = await this.repos.user.getByUsername(username);
		const userSubscription = await this.repos.subscription.getById(user.subscription.id);

		// Calculate end date using RevenueCat timestamp if provided, or fallback to +1 month
		const now = new Date();

		switch (type) {
			case 'INITIAL_PURCHASE':
			case 'RENEWAL':
			case 'PRODUCT_CHANGE':
			case 'UNCANCELLATION': {
				if (!productId) break;
				const level = await this.repos.subscriptionLevel.getByGoogleProductId(productId);
				const expirationDate = expirationAtMs ? new Date(expirationAtMs) : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
				userSubscription.subscriptionLevel = level;
				userSubscription.startDate = new Date();
				userSubscription.renewalDate = expirationDate;
				break;
			}

			case 'EXPIRATION': {
				const level = await this.repos.subscriptionLevel.getFree();
				userSubscription.subscriptionLevel = level;
				userSubscription.startDate = new Date();
				userSubscription.renewalDate = null;
				break;
			}

			case 'CANCELLATION': {
				// User turned off auto-renew in Google Play.
				// Do NOT revoke tier or change subscriptionLevel yet.
				// Access remains active until EXPIRATION is triggered by RevenueCat.
				break;
			}

			default:
				break;
		}
		await this.flush();

		return {success: true};
	}
}
