import { ROUTES } from '@northernexplorer/types';
import { Repositories } from '../../core/repositories';
import { Params, RouteDefinition, Response } from '@northernexplorer/types';

type Route<M extends keyof ROUTES['environment']['ForecastController']> = RouteDefinition<
  'environment',
  'ForecastController'
>[M];

export class ForecastController {
  constructor(private repos: Repositories) {}

  public async getForecastData(
    params: Params<Route<'getForecastData'>>,
  ): Promise<Response<Route<'getForecastData'>>> {
    const { lat, lon } = params;
    return this.repos.forecast.getForecastCache(Number(lat), Number(lon));
  }
}
