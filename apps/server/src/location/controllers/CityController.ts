import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';

type Route<M extends keyof ROUTES['location']['CityController']> = RouteDefinition<'location', 'CityController'>[M];

export class CityController {
	constructor(private repos: Repositories) {}

	public async getCityData(params: Params<Route<'getCityData'>>): Promise<Response<Route<'getCityData'>>> {
		const {lat, lon} = params;
		return this.repos.city.getCityCache(lat, lon);
	}
}
