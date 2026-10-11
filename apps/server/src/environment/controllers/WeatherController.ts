import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['environment']['WeatherController']> = RouteDefinition<'environment', 'WeatherController'>[M];

export class WeatherController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public async getData(params: Params<Route<'getData'>>): Promise<Response<Route<'getData'>>> {
		const {lat, lon} = params;
		const weather = this.repos.weather.getCache(Number(lat), Number(lon));

		await this.flush();
		return weather;
	}
}
