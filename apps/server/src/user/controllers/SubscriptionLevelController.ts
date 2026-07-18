import {Repositories} from '../../core/repositories';
import {Response, RouteDefinition, ROUTES} from '@northernexplorer/types';

type Route<M extends keyof ROUTES['user']['SubscriptionLevelController']> = RouteDefinition<'user', 'SubscriptionLevelController'>[M];

export class SubscriptionLevelController {
	constructor(private repos: Repositories) {}

	async getSubscriptionLevels(): Promise<Response<Route<'getSubscriptionLevels'>>> {
		return this.repos.subscriptionLevel.getAll();
	}
}
