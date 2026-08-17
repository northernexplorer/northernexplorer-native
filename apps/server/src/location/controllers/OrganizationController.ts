import {Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['location']['OrganizationController']> = RouteDefinition<'location', 'OrganizationController'>[M];

export class OrganizationController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	getAll(): Promise<Response<Route<'getAll'>>> {
		return this.repos.organization.getAll();
	}
}
