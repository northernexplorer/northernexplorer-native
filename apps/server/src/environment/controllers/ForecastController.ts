import {ROUTES} from '@northernexplorer/types';
import {Params, RouteDefinition, Response} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['environment']['ForecastController']> = RouteDefinition<'environment', 'ForecastController'>[M];

export class ForecastController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public async getForecastData(params: Params<Route<'getForecastData'>>): Promise<Response<Route<'getForecastData'>>> {
		const {lat, lon} = params;
		const forecast = this.repos.forecast.getForecastCache(Number(lat), Number(lon));

		await this.flush();
		return forecast;
	}
}
