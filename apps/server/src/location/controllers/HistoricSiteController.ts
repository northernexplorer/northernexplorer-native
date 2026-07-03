import { Request, Response } from 'express';
import { Repositories } from '../../core/typeHelpers';

export class HistoricSiteController {
  constructor(private repos: Repositories) {}

  public async getNearbyHistoricSites(req: Request, res: Response) {
    const lat = res.locals.lat;
    const lon = res.locals.lon;

    return this.repos.historicSite.getClosestHistoricSites(lat, lon);
  }

  /**
   * Fetches a single specific historic site by its unique ID record identifier.
   */
  public async getHistoricSiteById(req: Request, res: Response) {
    const id = (req.query.id as string) || (req.params.id as string);

    if (!id) throw new Error('Historic site ID is required.');

    return this.repos.historicSite.getHistoricSiteDetails(id);
  }
}
