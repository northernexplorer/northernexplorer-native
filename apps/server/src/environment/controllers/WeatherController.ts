import { Repositories } from '../../core/repositories';
import { Params, Response, RouteDefinition, ROUTES } from '@northernexplorer/types';

type Route<M extends keyof ROUTES['environment']['WeatherController']> = RouteDefinition<
  'environment',
  'WeatherController'
>[M];

export class WeatherController {
  constructor(private repos: Repositories) {}

  public async getWeatherData(
    params: Params<Route<'getWeatherData'>>,
  ): Promise<Response<Route<'getWeatherData'>>> {
    const { lat, lon } = params;
    return this.repos.weather.getWeatherCache(Number(lat), Number(lon));
  }
}
