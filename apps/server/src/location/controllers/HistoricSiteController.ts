import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from "../../core/BaseController";

type Route<M extends keyof ROUTES['location']['HistoricSiteController']> = RouteDefinition<'location', 'HistoricSiteController'>[M];

export class HistoricSiteController extends BaseController {
    constructor(repos: Repositories) {
        super(repos);
    }

	public async getNearbyHistoricSites(params: Params<Route<'getNearbyHistoricSites'>>): Promise<Response<Route<'getNearbyHistoricSites'>>> {
		const {lat, lon, limit} = params;
		return this.repos.historicSite.getClosestHistoricSites(lat, lon, limit);
	}

	public async getHistoricSiteById(params: Params<Route<'getHistoricSiteById'>>): Promise<Response<Route<'getHistoricSiteById'>>> {
		const {id} = params;

		return this.repos.historicSite.getHistoricSiteDetails(id);
	}
}
