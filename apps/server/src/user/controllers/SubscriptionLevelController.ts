import {Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['user']['SubscriptionLevelController']> = RouteDefinition<'user', 'SubscriptionLevelController'>[M];

export class SubscriptionLevelController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	async getSubscriptionLevels(): Promise<Response<Route<'getSubscriptionLevels'>>> {
		const subscriptionLevels = await this.repos.subscriptionLevel.getAll();
		const features = await this.repos.subscriptionFeature.getAll();

		return subscriptionLevels.map(level => {
			const levelFeatures = features.filter(feature => feature.subscriptionLevels.getItems().some(sl => sl.id === level.id));

			return {
				...level,
				features: levelFeatures,
			};
		});
	}
}
