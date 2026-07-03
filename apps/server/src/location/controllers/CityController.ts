import { Request, Response } from 'express';
import { Repositories } from '../../core/typeHelpers';

export class CityController {
  constructor(private repos: Repositories) {}

  public async getCityData(req: Request, res: Response) {
    const lat = res.locals.lat;
    const lon = res.locals.lon;

    return this.repos.city.getCityCache(lat, lon);
  }
}
