import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';

type Route<M extends keyof ROUTES['location']['HistoricSiteController']> = RouteDefinition<'location', 'HistoricSiteController'>[M];

export class HistoricSiteController {
	constructor(private repos: Repositories) {}

	public async getNearbyHistoricSites(params: Params<Route<'getNearbyHistoricSites'>>): Promise<Response<Route<'getNearbyHistoricSites'>>> {
		const {lat, lon, limit} = params;
		return this.repos.historicSite.getClosestHistoricSites(lat, lon, limit);
	}

	public async getHistoricSiteById(params: Params<Route<'getHistoricSiteById'>>): Promise<Response<Route<'getHistoricSiteById'>>> {
		const {id} = params;

		return this.repos.historicSite.getHistoricSiteDetails(id);
	}
}
