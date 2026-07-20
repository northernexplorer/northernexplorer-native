import {Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['user']['SubscriptionLevelController']> = RouteDefinition<'user', 'SubscriptionLevelController'>[M];

export class SubscriptionLevelController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	async getSubscriptionLevels(): Promise<Response<Route<'getSubscriptionLevels'>>> {
		return this.repos.subscriptionLevel.getAll();
	}
}
