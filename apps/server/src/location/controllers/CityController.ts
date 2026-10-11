import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['location']['CityController']> = RouteDefinition<'location', 'CityController'>[M];

export class CityController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public async getData(params: Params<Route<'getData'>>): Promise<Response<Route<'getData'>>> {
		const {lat, lon} = params;
		const city = this.repos.city.getCache(lat, lon);

		await this.flush();
		return city;
	}
}
