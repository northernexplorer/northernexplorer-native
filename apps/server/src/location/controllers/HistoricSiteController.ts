import { Repositories } from '../../core/repositories';;
import { ROUTES } from '@northernexplorer/types';

export class HistoricSiteController {
  constructor(private repos: Repositories) {}

  public async getNearbyHistoricSites({
    lat,
    lon,
  }: ROUTES['location']['HistoricSiteController']['getNearbyHistoricSites']['params']) {
    return this.repos.historicSite.getClosestHistoricSites(lat, lon);
  }

  /**
   * Fetches a single specific historic site by its unique ID record identifier.
   */
  public async getHistoricSiteById({
    id,
  }: ROUTES['location']['HistoricSiteController']['getHistoricSiteById']['params']) {
    if (!id) throw new Error('Historic site ID is required.');

    return this.repos.historicSite.getHistoricSiteDetails(id);
  }
}
