import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['location']['CityController']> = RouteDefinition<'location', 'CityController'>[M];

export class CityController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public async getCityData(params: Params<Route<'getCityData'>>): Promise<Response<Route<'getCityData'>>> {
		const {lat, lon} = params;
		const city = this.repos.city.getCityCache(lat, lon);

		await this.flush();
		return city;
	}
}
