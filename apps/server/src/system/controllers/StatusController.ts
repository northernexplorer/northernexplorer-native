import {Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';

type Route<M extends keyof ROUTES['system']['StatusController']> = RouteDefinition<'system', 'StatusController'>[M];

export class StatusController {
	constructor(private repos: Repositories) {}

	public getOnlineStatus(): Response<Route<'getOnlineStatus'>> {
		return true;
	}
}
