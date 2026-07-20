import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['location']['RegionController']> = RouteDefinition<'location', 'RegionController'>[M];

export class RegionController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public async getRegionById(params: Params<Route<'getRegionById'>>): Promise<Response<Route<'getRegionById'>>> {
		const {id} = params;
		return this.repos.region.getRegionById(id);
	}
}
