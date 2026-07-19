import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {PermissionService} from '../services/PermisionService';
import {AuthContext} from '../../index';

type Route<M extends keyof ROUTES['user']['SubscriptionController']> = RouteDefinition<'user', 'SubscriptionController'>[M];

export class SubscriptionController {
	constructor(private repos: Repositories) {}

	private permissionService = new PermissionService();

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

	async changeSubscription(params: Params<Route<'changeSubscription'>>, auth?: AuthContext): Promise<Response<Route<'changeSubscription'>>> {
		const user = await this.repos.user.getByUsername(params.username);
		this.permissionService.canAccessProfile({
			userId: auth?.userId,
			targetId: user.id,
		});

		const subscription = await this.repos.subscription.getById(user.subscription.id);
		const newSubscriptionLevel = await this.repos.subscriptionLevel.getById(params.subscriptionLevelId);

		const startDate = new Date();
		const renewalDate = new Date();
		renewalDate.setMonth(startDate.getMonth() + 1);

		subscription.subscriptionLevel = newSubscriptionLevel;
		subscription.startDate = startDate;
		subscription.renewalDate = renewalDate;

		await this.repos.subscription.getEntityManager().flush();

		return {success: true};
	}
}
