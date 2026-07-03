import { Repositories } from '../../core/repositories';;
import { ROUTES } from '@northernexplorer/types';

export class WeatherController {
  constructor(private repos: Repositories) {}

  public async getWeatherData({
    lat,
    lon,
  }: ROUTES['environment']['WeatherController']['getWeatherData']['params']) {
    return this.repos.weather.getWeatherCache(Number(lat), Number(lon));
  }
}
