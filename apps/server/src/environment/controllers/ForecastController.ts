import { Request, Response } from 'express';
import { Repositories } from '../../core/typeHelpers';

export class ForecastController {
  constructor(private repos: Repositories) {}

  public async getForecastData(req: Request, res: Response) {
    const lat = res.locals.lat;
    const lon = res.locals.lon;

    return this.repos.forecast.getForecastCache(lat, lon);
  }
}
