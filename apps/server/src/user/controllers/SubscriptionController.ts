import {Params, Response, RolesEnum, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {PermissionService} from '../services/PermisionService';
import {AuthContext} from '../../index';
import {BaseController} from '../../core/BaseController';
import {config} from '../../config';

type Route<M extends keyof ROUTES['user']['SubscriptionController']> = RouteDefinition<'user', 'SubscriptionController'>[M];

export class SubscriptionController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	private permissionService = new PermissionService();

	async getPermissions(params: Params<Route<'getPermissions'>>, auth?: AuthContext): Promise<Response<Route<'getPermissions'>>> {
		if (!auth?.userId) return null;
		const user = await this.repos.user.getById(auth.userId);
		this.permissionService.canAccessProfile({targetId: user.id}, auth);

		const subscription = await this.repos.subscription.getById(user.subscription.id);
		const subscriptionLevel = await this.repos.subscriptionLevel.getById(subscription.subscriptionLevel.id);

		return {
			navigation: {
				useCompass: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name),
				changeMapStyle: ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name),
			},
		};
	}

	async getByUsername(params: Params<Route<'getByUsername'>>, auth?: AuthContext): Promise<Response<Route<'getByUsername'>>> {
		const user = await this.repos.user.getByUsername(params.username);
		this.permissionService.canAccessProfile({targetId: user.id}, auth);

		const subscription = await this.repos.subscription.getById(user.subscription.id);
		const subscriptionLevel = await this.repos.subscriptionLevel.getById(subscription.subscriptionLevel.id);

		return {subscription, subscriptionLevel};
	}

	async revenueCatUpgrade(params: Params<Route<'revenueCatUpgrade'>>) {
		if (params.secret !== config.REVENUE_CAT_ACCESS_CODE) throw new Error('Unauthorized');
		if (!params.event) throw new Error('Invalid webhook payload');

		const {type, app_user_id: username, product_id: productId, expiration_at_ms: expirationAtMs} = params.event;

		if (!username) throw new Error('Missing app_user_id in webhook event');

		const user = await this.repos.user.getByUsername(username);
		const userSubscription = await this.repos.subscription.getById(user.subscription.id);

		const now = new Date();

		switch (type) {
			case 'INITIAL_PURCHASE':
			case 'RENEWAL':
			case 'PRODUCT_CHANGE':
			case 'UNCANCELLATION': {
				if (!productId) break;
				const baseProductId = productId.split(':')[0];
				const level = await this.repos.subscriptionLevel.getByGoogleProductId(baseProductId);
				const expirationDate = expirationAtMs
					? new Date(Number(expirationAtMs))
					: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

				userSubscription.subscriptionLevel = level;
				userSubscription.startDate = now;

				userSubscription.renewalDate = expirationDate;
				break;
			}

			case 'EXPIRATION': {
				userSubscription.subscriptionLevel = await this.repos.subscriptionLevel.getFree();
				userSubscription.startDate = new Date();
				userSubscription.renewalDate = null;
				break;
			}

			case 'CANCELLATION': {
				// User turned off auto-renew in Google Play.
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
