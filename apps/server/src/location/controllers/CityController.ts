import { Repositories } from '../../core/repositories';;
import { ROUTES } from '@northernexplorer/types';

export class CityController {
  constructor(private repos: Repositories) {}

  public async getCityData({
    lat,
    lon,
  }: ROUTES['location']['CityController']['getCityData']['params']) {
    return this.repos.city.getCityCache(lat, lon);
  }
}
