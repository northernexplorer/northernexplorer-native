import {Params, PublishStatusEnum, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {PointOfInterestFavorite} from '../entities/PointofInterestFavorite';

type Route<M extends keyof ROUTES['location']['PointOfInterestController']> = RouteDefinition<'location', 'PointOfInterestController'>[M];

export class PointOfInterestController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}
	private permissionService = new PermissionService();

	public async getNearbyPointOfInterests(
		params: Params<Route<'getNearbyPointOfInterests'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'getNearbyPointOfInterests'>>> {
		const {lat, lon, limit, selectedPoiTypes, visitedFilter} = params;
		return this.repos.pointOfInterest.getClosestPointOfInterests(lat, lon, limit, auth?.userId, selectedPoiTypes, visitedFilter);
	}

	public async createPointOfInterestFavorite(
		params: Params<Route<'createPointOfInterestFavorite'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'createPointOfInterestFavorite'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);

		const user = await this.repos.user.getById(userId);

		const pointOfInterest = await this.repos.pointOfInterest.getById(params.id);

		const existingFavorite = await this.repos.pointOfInterestFavorite.findOne({
			user: user,
			pointOfInterest: pointOfInterest,
		});

		if (existingFavorite) {
			return {success: true};
		}
		const newFavorite = new PointOfInterestFavorite({
			pointOfInterest,
			user,
		});

		this.persist(newFavorite);

		await this.flush();

		return {success: true};
	}

	public async unmarkPointOfInterestFavorite(
		params: Params<Route<'createPointOfInterestFavorite'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'unmarkPointOfInterestFavorite'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		const user = await this.repos.user.getById(userId);

		const pointOfInterest = await this.repos.pointOfInterest.getById(params.id);

		const existingFavorite = await this.repos.pointOfInterestFavorite.findOne({
			user: user,
			pointOfInterest: pointOfInterest,
		});

		if (!existingFavorite) {
			return {success: true};
		}

		this.repos.pointOfInterestFavorite.remove(existingFavorite);

		await this.flush();

		return {success: true};
	}

	public async isPointOfInterestFavorite(
		params: Params<Route<'isPointOfInterestFavorite'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'isPointOfInterestFavorite'>>> {
		if (!auth?.userId) return {Favorited: false};

		const favorite = await this.repos.pointOfInterestFavorite.findPointOfInterestFavoritesById(params.id, auth.userId);
		return {Favorited: Boolean(favorite)};
	}

	public async getPointOfInterestById(
		params: Params<Route<'getPointOfInterestById'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'getPointOfInterestById'>>> {
		const pointOfInterest = await this.repos.pointOfInterest.getPointOfInterestById(params.id, auth?.userId);
		if (pointOfInterest.status === PublishStatusEnum.Draft) {
			this.permissionService.canAccessAdmin(auth);
		}
		const averageRating = await this.repos.review.getAverageRatingByPointOfInterestId(pointOfInterest.id);
		return {...pointOfInterest, averageRating};
	}

	async getPointOfInterestFavorites(
		params: Params<Route<'getPointOfInterestFavorites'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'getPointOfInterestFavorites'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);

		const favorites = await this.repos.pointOfInterestFavorite.findPointOfInterestFavoritesByUserId(userId);

		return favorites.map(favorite => ({
			id: favorite.id,
			pointOfInterest: {
				id: favorite.pointOfInterest.id,
				description: favorite.pointOfInterest.description,
				country: favorite.pointOfInterest.country.name,
				region: favorite.pointOfInterest.region.name,
			},
			user: favorite.user.id,
		}));
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
			organization: site.organization,
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
			organization: site.organization,
		}));
	}

	async edit(params: Params<Route<'edit'>>, auth?: AuthContext): Promise<Response<Route<'edit'>>> {
		this.permissionService.canAccessAdmin(auth);

		const {id, countryId, regionId, startDate, endDate, organizationId, ...updates} = params;

		const pointOfInterest = await this.repos.pointOfInterest.getById(id);
		const country = await this.repos.country.getById(countryId);
		const region = await this.repos.region.getById(regionId);
		const organization = await this.repos.organization.getById(organizationId);

		pointOfInterest.edit({
			...updates,
			country,
			region,
			startDate,
			endDate,
			organization,
		});

		await this.flush();

		return {success: true};
	}
}
