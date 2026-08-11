import {Params, PublishStatusEnum, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';

type Route<M extends keyof ROUTES['location']['PointOfInterestController']> = RouteDefinition<'location', 'PointOfInterestController'>[M];

export class PointOfInterestController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}
	private permissionService = new PermissionService();

	public async getNearbyPointOfInterests(params: Params<Route<'getNearbyPointOfInterests'>>): Promise<Response<Route<'getNearbyPointOfInterests'>>> {
		const {lat, lon, limit} = params;
		return this.repos.pointOfInterest.getClosestPointOfInterests(lat, lon, limit);
	}

	public async getPointOfInterestById(
		params: Params<Route<'getPointOfInterestById'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'getPointOfInterestById'>>> {
		const pointOfInterest = await this.repos.pointOfInterest.getPointOfInterestDetails(params.id);
		if (pointOfInterest.status === PublishStatusEnum.Draft) {
			this.permissionService.canAccessAdmin(auth);
		}
		return pointOfInterest;
	}

	async getPublished(params: Params<Route<'getPublished'>>, auth?: AuthContext): Promise<Response<Route<'getPublished'>>> {
		this.permissionService.canAccessAdmin(auth);
		const sites = await this.repos.pointOfInterest.getPublished();

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
			type: site.type,
		}));
	}

	async getDrafts(params: Params<Route<'getDrafts'>>, auth?: AuthContext): Promise<Response<Route<'getDrafts'>>> {
		this.permissionService.canAccessAdmin(auth);
		const sites = await this.repos.pointOfInterest.getDrafts();

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
			type: site.type,
		}));
	}

	async edit(params: Params<Route<'edit'>>, auth?: AuthContext): Promise<Response<Route<'edit'>>> {
		this.permissionService.canAccessAdmin(auth);

		const {id, countryId, regionId, startDate, endDate, ...updates} = params;

		const pointOfInterest = await this.repos.pointOfInterest.getById(id);
		const country = await this.repos.country.getById(countryId);
		const region = await this.repos.region.getById(regionId);

		pointOfInterest.edit({
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
