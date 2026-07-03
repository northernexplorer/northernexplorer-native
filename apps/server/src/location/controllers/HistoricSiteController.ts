import { Repositories } from '../../core/repositories';
import { Params, Response, RouteDefinition, ROUTES } from '@northernexplorer/types';

type Route<M extends keyof ROUTES['location']['HistoricSiteController']> = RouteDefinition<
  'location',
  'HistoricSiteController'
>[M];

export class HistoricSiteController {
  constructor(private repos: Repositories) {}

  public async getNearbyHistoricSites(
    params: Params<Route<'getNearbyHistoricSites'>>,
  ): Promise<Response<Route<'getNearbyHistoricSites'>>> {
    const { lat, lon } = params;
    return this.repos.historicSite.getClosestHistoricSites(lat, lon);
  }

  public async getHistoricSiteById(
    params: Params<Route<'getHistoricSiteById'>>,
  ): Promise<Response<Route<'getHistoricSiteById'>>> {
    const { id } = params;

    return this.repos.historicSite.getHistoricSiteDetails(id);
  }
}
