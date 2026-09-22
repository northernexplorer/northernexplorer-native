import {Params, PublishStatusEnum, Response, RolesEnum, RouteDefinition, ROUTES} from '@northernexplorer/types';
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

	public async getNearbyPointOfInterests(
		params: Params<Route<'getNearbyPointOfInterests'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'getNearbyPointOfInterests'>>> {
		const {lat, lon, limit, selectedPoiTypes, visitedFilter, minRating, maxDifficultyIndex, maxCostIndex, showDrafts} = params;

		let parsedDifficultyIndex = maxDifficultyIndex !== undefined ? Number(maxDifficultyIndex) : undefined;
		const parsedCostIndex = maxCostIndex !== undefined ? Number(maxCostIndex) : undefined;

		const MAX_FREE_DIFFICULTY_INDEX = 2;

		let hasAdvancedAccess = false;
		let showDraftsParsed = showDrafts === true || (showDrafts as unknown) === 'true';

		if (auth?.userId) {
			const user = await this.repos.user.getById(auth.userId);
			const subscription = await this.repos.subscription.getById(user.subscription.id);
			const subscriptionLevel = await this.repos.subscriptionLevel.getById(subscription.subscriptionLevel.id);

			if (['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name)) {
				hasAdvancedAccess = true;
			}

			if (!user.roles?.includes(RolesEnum.Admin)) {
				showDraftsParsed = false;
			}
		}

		// Apply the restriction if the user lacks advanced access or is unauthenticated
		if (!hasAdvancedAccess) {
			if (parsedDifficultyIndex === undefined || parsedDifficultyIndex > MAX_FREE_DIFFICULTY_INDEX) {
				parsedDifficultyIndex = MAX_FREE_DIFFICULTY_INDEX;
			}
		}

		return this.repos.pointOfInterest.getClosestPointOfInterests({
			lat,
			lon,
			limit,
			showDrafts: showDraftsParsed,
			userId: auth?.userId,
			selectedPoiTypes,
			visitedFilter,
			minRating,
			maxDifficultyIndex: parsedDifficultyIndex,
			maxCostIndex: parsedCostIndex,
		});
	}

	public async getPointOfInterestById(
		params: Params<Route<'getPointOfInterestById'>>,
		auth?: AuthContext,
	): Promise<Response<Route<'getPointOfInterestById'>>> {
		const pointOfInterest = await this.repos.pointOfInterest.getPointOfInterestById(params.id, auth?.userId);
		if (pointOfInterest.status === PublishStatusEnum.Draft) {
			this.permissionService.canAccessAdmin(auth);
		}
		return pointOfInterest;
	}

	async getPublished(params: Params<Route<'getPublished'>>, auth?: AuthContext): Promise<Response<Route<'getPublished'>>> {
		this.permissionService.canAccessAdmin(auth);
		const sites = await this.repos.pointOfInterest.getPublished({limit: params.limit, offset: params.offset});

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
		const sites = await this.repos.pointOfInterest.getDrafts({limit: params.limit, offset: params.offset});

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
		const image = await this.repos.image.getById(params.imageId);

		pointOfInterest.edit({
			...updates,
			country,
			region,
			startDate,
			endDate,
			organization,
			image,
		});

		await this.flush();

		return {success: true};
	}
}
