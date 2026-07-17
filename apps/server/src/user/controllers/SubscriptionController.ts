import {Repositories} from '../../core/repositories';
import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {TokenPayload} from '../services/TokenService';
import {PermissionService} from '../services/PermisionService';
import {AuthContext} from "../../index";

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
		const subscriptionLevel = await this.repos.subscriptionLevel.getById(subscription.id);

		return {subscription, subscriptionLevel};
	}
}
