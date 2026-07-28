import {Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['system']['StatusController']> = RouteDefinition<'system', 'StatusController'>[M];

export class StatusController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public getStatus(): Response<Route<'getStatus'>> {
		return {online: true, upgradeRequired: false};
	}
}
