import { Request, Response } from 'express';
import { Repositories } from '../../core/typeHelpers';

export class WeatherController {
  constructor(private repos: Repositories) {}

  public async getWeatherData(req: Request, res: Response) {
    const lat = res.locals.lat;
    const lon = res.locals.lon;

    return this.repos.weather.getWeatherCache(Number(lat), Number(lon));
  }
}
