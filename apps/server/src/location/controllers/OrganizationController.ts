import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['location']['OrganizationController']> = RouteDefinition<'location', 'OrganizationController'>[M];

export class OrganizationController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	async getAll(params?: Params<Route<'getAll'>>): Promise<Response<Route<'getAll'>>> {
		const regionId = params?.regionId || params?.id;
		if (regionId) {
			return this.repos.organization.getByRegion(regionId);
		}
		return this.repos.organization.getAll();
	}

	async getByRegionId(params: Params<Route<'getByRegionId'>>): Promise<Response<Route<'getByRegionId'>>> {
		return this.repos.organization.getByRegion(params.id);
	}
}
