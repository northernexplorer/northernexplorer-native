import {Params, PublishStatusEnum, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../index';
import {PermissionService} from '../../user/services/PermisionService';

type Route<M extends keyof ROUTES['location']['HistoricSiteController']> = RouteDefinition<'location', 'HistoricSiteController'>[M];

export class HistoricSiteController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}
	private permissionService = new PermissionService();

	public async getNearbyHistoricSites(params: Params<Route<'getNearbyHistoricSites'>>): Promise<Response<Route<'getNearbyHistoricSites'>>> {
		const {lat, lon, limit} = params;
		return this.repos.historicSite.getClosestHistoricSites(lat, lon, limit);
	}

	public async getHistoricSiteById(
		params: Params<Route<'getHistoricSiteById'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'getHistoricSiteById'>>> {
		const historicSite = await this.repos.historicSite.getHistoricSiteDetails(params.id);
		if (historicSite.status === PublishStatusEnum.Draft) {
			this.permissionService.canAccessAdmin(auth);
		}
		return historicSite;
	}

	async getPublished(params: Params<Route<'getPublished'>>, auth?: AuthContext): Promise<Response<Route<'getPublished'>>> {
		this.permissionService.canAccessAdmin(auth);
		const sites = await this.repos.historicSite.getPublished();

		return sites.map(site => ({
			id: site.id,
			name: site.name,
			description: site.description,
			image: site.image,
			lat: site.lat,
			lon: site.lon,
			startDate: site.startDate,
			endDate: site.endDate,
			status: site.status,
			region: site.region,
			country: site.country,
		}));
	}

	async getDrafts(params: Params<Route<'getDrafts'>>, auth?: AuthContext): Promise<Response<Route<'getDrafts'>>> {
		this.permissionService.canAccessAdmin(auth);
		const sites = await this.repos.historicSite.getDrafts();

		return sites.map(site => ({
			id: site.id,
			name: site.name,
			description: site.description,
			image: site.image,
			lat: site.lat,
			lon: site.lon,
			startDate: site.startDate,
			endDate: site.endDate,
			status: site.status,
			region: site.region,
			country: site.country,
		}));
	}

	async edit(params: Params<Route<'edit'>>, auth?: AuthContext): Promise<Response<Route<'edit'>>> {
		this.permissionService.canAccessAdmin(auth);

		const {id, countryId, regionId, startDate, endDate, ...updates} = params;

		const historicSite = await this.repos.historicSite.getById(id);
		const country = await this.repos.country.getById(countryId);
		const region = await this.repos.region.getById(regionId);

		historicSite.edit({
			...updates,
			country,
			region,
			startDate,
			endDate,
		});

		await this.flush();

		return {success: true};
	}
}
