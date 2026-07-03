import { ROUTES } from '@northernexplorer/types';
import { Repositories } from '../../core/repositories';

export class ForecastController {
  constructor(private repos: Repositories) {}

  public async getForecastData({
    lat,
    lon,
  }: ROUTES['environment']['ForecastController']['getForecastData']['params']) {
    return this.repos.forecast.getForecastCache(Number(lat), Number(lon));
  }
}
