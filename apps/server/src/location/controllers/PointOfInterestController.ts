import {
	Params,
	PointOfInterestTypeEnum,
	PublishStatusEnum,
	Response,
	RolesEnum,
	RouteDefinition,
	ROUTES,
	SiteDifficultyEnum,
	VisitedFilterEnum,
} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {PointOfInterestFavorite} from '../entities/PointofInterestFavorite';
import {PointOfInterest} from '../entities/PointOfInterest';

type Route<M extends keyof ROUTES['location']['PointOfInterestController']> = RouteDefinition<'location', 'PointOfInterestController'>[M];

const DEFAULT_SEARCH_LIMIT = 20;
const MAX_SEARCH_LIMIT = 50;
const MAX_SEARCH_OFFSET = 100_000;

const normalizeInteger = (value: unknown, fallback: number, min: number, max: number) => {
	const parsedValue = Number(value);
	if (!Number.isFinite(parsedValue)) return fallback;
	return Math.min(Math.max(Math.floor(parsedValue), min), max);
};

const normalizeOptionalInteger = (value: unknown, max: number) => {
	if (value === undefined || value === null || value === '') return undefined;
	return normalizeInteger(value, 0, 0, max);
};

const normalizeOptionalNumber = (value: unknown, min: number, max: number) => {
	if (value === undefined || value === null || value === '') return undefined;
	const parsedValue = Number(value);
	if (!Number.isFinite(parsedValue)) return undefined;
	return Math.min(Math.max(parsedValue, min), max);
};

export class PointOfInterestController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}
	private permissionService = new PermissionService();

	public async getNearby(params: Params<Route<'getNearby'>>, auth?: AuthContext): Promise<Response<Route<'getNearby'>>> {
		const {
			lat,
			lon,
			limit,
			offset,
			selectedPoiTypes,
			visitedFilter,
			minRating,
			minDifficultyIndex,
			maxDifficultyIndex,
			minCostIndex,
			maxCostIndex,
			showDrafts,
		} = params;

		let hasAdvancedAccess = false;
		let showDraftsParsed = showDrafts === true || (showDrafts as unknown) === 'true';

		if (auth?.userId) {
			const user = await this.repos.user.getById(auth.userId);
			const subscription = await this.repos.subscription.getById(user.subscription.id);
			const subscriptionLevel = await this.repos.subscriptionLevel.getById(subscription.subscriptionLevel.id);
			const permissions = this.repos.subscriptionLevel.getPermissions(subscriptionLevel);

			if (permissions.navigation.useRemoteDifficulty || ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name)) {
				hasAdvancedAccess = true;
			}

			if (!user.roles?.includes(RolesEnum.Admin)) {
				showDraftsParsed = false;
			}
		}

		const maxAllowedDifficultyIndex = hasAdvancedAccess ? Object.values(SiteDifficultyEnum).length - 1 : 3;
		let parsedMinDifficultyIndex = minDifficultyIndex !== undefined && minDifficultyIndex !== null ? Number(minDifficultyIndex) : undefined;
		let parsedMaxDifficultyIndex = maxDifficultyIndex !== undefined && maxDifficultyIndex !== null ? Number(maxDifficultyIndex) : undefined;
		const parsedMinCostIndex = minCostIndex !== undefined && minCostIndex !== null ? Number(minCostIndex) : undefined;
		const parsedMaxCostIndex = maxCostIndex !== undefined && maxCostIndex !== null ? Number(maxCostIndex) : undefined;

		// Apply the restriction if the user lacks advanced access or is unauthenticated
		if (!hasAdvancedAccess) {
			if (parsedMaxDifficultyIndex === undefined || parsedMaxDifficultyIndex > maxAllowedDifficultyIndex) {
				parsedMaxDifficultyIndex = maxAllowedDifficultyIndex;
			}
			if (parsedMinDifficultyIndex !== undefined && parsedMinDifficultyIndex > maxAllowedDifficultyIndex) {
				parsedMinDifficultyIndex = maxAllowedDifficultyIndex;
			}
		}

		return this.repos.pointOfInterest.getClosest({
			lat,
			lon,
			limit,
			offset,
			showDrafts: showDraftsParsed,
			userId: auth?.userId,
			selectedPoiTypes,
			visitedFilter,
			minRating,
			minDifficultyIndex: parsedMinDifficultyIndex,
			maxDifficultyIndex: parsedMaxDifficultyIndex,
			minCostIndex: parsedMinCostIndex,
			maxCostIndex: parsedMaxCostIndex,
		});
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
	public async getForMap(params: Params<Route<'getForMap'>>, auth?: AuthContext): Promise<Response<Route<'getForMap'>>> {
		const {
			lat,
			lon,
			limit,
			selectedPoiTypes,
			visitedFilter,
			minRating,
			minDifficultyIndex,
			maxDifficultyIndex,
			minCostIndex,
			maxCostIndex,
			showDrafts,
		} = params;

		let hasAdvancedAccess = false;
		let showDraftsParsed = showDrafts === true || (showDrafts as unknown) === 'true';

		if (auth?.userId) {
			const user = await this.repos.user.getById(auth.userId);
			const subscription = await this.repos.subscription.getById(user.subscription.id);
			const subscriptionLevel = await this.repos.subscriptionLevel.getById(subscription.subscriptionLevel.id);
			const permissions = this.repos.subscriptionLevel.getPermissions(subscriptionLevel);

			if (permissions.navigation.useRemoteDifficulty) {
				hasAdvancedAccess = true;
			}

			if (!user.roles?.includes(RolesEnum.Admin)) {
				showDraftsParsed = false;
			}
		}

		const maxAllowedDifficultyIndex = hasAdvancedAccess ? Object.values(SiteDifficultyEnum).length - 1 : 3;
		let parsedMinDifficultyIndex = minDifficultyIndex !== undefined && minDifficultyIndex !== null ? Number(minDifficultyIndex) : undefined;
		let parsedMaxDifficultyIndex =
			maxDifficultyIndex !== undefined && maxDifficultyIndex !== null ? Number(maxDifficultyIndex) : maxAllowedDifficultyIndex;
		const parsedMinCostIndex = minCostIndex !== undefined && minCostIndex !== null ? Number(minCostIndex) : undefined;
		const parsedMaxCostIndex = maxCostIndex !== undefined && maxCostIndex !== null ? Number(maxCostIndex) : undefined;

		if (!hasAdvancedAccess) {
			if (parsedMaxDifficultyIndex > maxAllowedDifficultyIndex) {
				parsedMaxDifficultyIndex = maxAllowedDifficultyIndex;
			}
			if (parsedMinDifficultyIndex !== undefined && parsedMinDifficultyIndex > maxAllowedDifficultyIndex) {
				parsedMinDifficultyIndex = maxAllowedDifficultyIndex;
			}
		}

		return this.repos.pointOfInterest.getClosest({
			lat,
			lon,
			limit,
			showDrafts: showDraftsParsed,
			userId: auth?.userId,
			selectedPoiTypes,
			visitedFilter,
			minRating,
			minDifficultyIndex: parsedMinDifficultyIndex,
			maxDifficultyIndex: parsedMaxDifficultyIndex,
			minCostIndex: parsedMinCostIndex,
			maxCostIndex: parsedMaxCostIndex,
		});
	}

	public async getById(params: Params<Route<'getById'>>, auth?: AuthContext): Promise<Response<Route<'getById'>>> {
		const pointOfInterest = await this.repos.pointOfInterest.getByIdPopulated(params.id, auth?.userId);
		if (pointOfInterest.status === PublishStatusEnum.Draft || pointOfInterest.status === PublishStatusEnum.Rejected) {
			this.permissionService.canAccessAdmin(auth);
		}
		return pointOfInterest;
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
				name: favorite.pointOfInterest.name,
				description: favorite.pointOfInterest.description,
				country: favorite.pointOfInterest.country.name,
				region: favorite.pointOfInterest.region.name,
				lat: favorite.pointOfInterest.lat,
				lon: favorite.pointOfInterest.lon,
				difficulty: favorite.pointOfInterest.difficulty,
				rating: favorite.pointOfInterest.rating,
			},
			image: favorite.pointOfInterest.image,
			user: favorite.user.id,
		}));
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
			establishedYear: site.establishedYear,
			status: site.status,
			rejectionReason: site.rejectionReason,
			region: site.region,
			country: site.country,
			type: site.type,
			organization: {
				id: site.organization.id,
				name: site.organization.name,
			},
		}));
	}

	async search(params: Params<Route<'search'>>, auth?: AuthContext): Promise<Response<Route<'search'>>> {
		const query = typeof params.query === 'string' ? params.query.trim() : '';
		let isAdmin = false;
		let hasAdvancedAccess = false;

		if (auth?.userId) {
			const user = await this.repos.user.getById(auth.userId);
			isAdmin = user.roles?.includes(RolesEnum.Admin) ?? false;

			const subscription = await this.repos.subscription.getById(user.subscription.id);
			const subscriptionLevel = await this.repos.subscriptionLevel.getById(subscription.subscriptionLevel.id);
			const permissions = this.repos.subscriptionLevel.getPermissions(subscriptionLevel);
			hasAdvancedAccess =
				permissions.navigation.useRemoteDifficulty || ['Pathfinder', 'Trailblazer', 'Pioneer', 'Legend'].includes(subscriptionLevel.name);
		}

		const difficultyMax = Object.values(SiteDifficultyEnum).length - 1;
		let minDifficultyIndex = normalizeOptionalInteger(params.minDifficultyIndex, difficultyMax);
		let maxDifficultyIndex = normalizeOptionalInteger(params.maxDifficultyIndex, difficultyMax);
		const maxAllowedDifficultyIndex = hasAdvancedAccess ? difficultyMax : 3;

		if (!hasAdvancedAccess) {
			if (maxDifficultyIndex === undefined || maxDifficultyIndex > maxAllowedDifficultyIndex) {
				maxDifficultyIndex = maxAllowedDifficultyIndex;
			}
			if (minDifficultyIndex !== undefined && minDifficultyIndex > maxAllowedDifficultyIndex) {
				minDifficultyIndex = maxAllowedDifficultyIndex;
			}
		}

		const selectedPoiTypes = Array.isArray(params.selectedPoiTypes)
			? params.selectedPoiTypes.filter(type => Object.values(PointOfInterestTypeEnum).includes(type))
			: [];
		const visitedFilter = Object.values(VisitedFilterEnum).includes(params.visitedFilter as VisitedFilterEnum)
			? params.visitedFilter
			: VisitedFilterEnum.All;

		return this.repos.pointOfInterest.searchByName({
			query,
			limit: normalizeInteger(params.limit, DEFAULT_SEARCH_LIMIT, 1, MAX_SEARCH_LIMIT),
			offset: normalizeInteger(params.offset, 0, 0, MAX_SEARCH_OFFSET),
			selectedPoiTypes,
			visitedFilter,
			minRating: normalizeOptionalNumber(params.minRating, 0, 5),
			minDifficultyIndex,
			maxDifficultyIndex,
			minCostIndex: normalizeOptionalInteger(params.minCostIndex, 4),
			maxCostIndex: normalizeOptionalInteger(params.maxCostIndex, 4),
			showDrafts: isAdmin && (params.showDrafts === true || (params.showDrafts as unknown) === 'true'),
			userId: auth?.userId,
		});
	}

	async getNewest(params: Params<Route<'getNewest'>>): Promise<Response<Route<'getNewest'>>> {
		return this.repos.pointOfInterest.getNewest({limit: params.limit, offset: params.offset});
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
			establishedYear: site.establishedYear,
			status: site.status,
			rejectionReason: site.rejectionReason,
			region: site.region,
			country: site.country,
			type: site.type,
			organization: {
				id: site.organization.id,
				name: site.organization.name,
			},
		}));
	}

	async getRejected(params: Params<Route<'getRejected'>>, auth?: AuthContext): Promise<Response<Route<'getRejected'>>> {
		this.permissionService.canAccessAdmin(auth);
		const sites = await this.repos.pointOfInterest.getRejected({limit: params.limit, offset: params.offset});

		return sites.map(site => ({
			id: site.id,
			name: site.name,
			description: site.description,
			image: site.image,
			lat: site.lat,
			lon: site.lon,
			establishedYear: site.establishedYear,
			status: site.status,
			rejectionReason: site.rejectionReason,
			region: site.region,
			country: site.country,
			type: site.type,
			organization: {
				id: site.organization.id,
				name: site.organization.name,
			},
		}));
	}

	async edit(params: Params<Route<'edit'>>, auth?: AuthContext): Promise<Response<Route<'edit'>>> {
		this.permissionService.canAccessAdmin(auth);

		const {id, countryId, regionId, establishedYear, organizationId, ...updates} = params;

		const pointOfInterest = await this.repos.pointOfInterest.getById(id);
		const country = await this.repos.country.getById(countryId);
		const region = await this.repos.region.getById(regionId);
		const organization = await this.repos.organization.getById(organizationId);
		const image = await this.repos.image.findOneOrFail({id: params.imageId});

		pointOfInterest.edit({
			...updates,
			country,
			region,
			establishedYear,
			organization,
			image,
		});

		await this.flush();

		return {success: true};
	}

	async create(params: Params<Route<'create'>>, auth?: AuthContext): Promise<Response<Route<'create'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		const user = await this.repos.user.getById(userId);
		const isAdmin = user.roles?.includes(RolesEnum.Admin);

		const {countryId, regionId, establishedYear, organizationId, ...data} = params;

		const country = await this.repos.country.getById(countryId);
		const region = await this.repos.region.getById(regionId);
		const organization = await this.repos.organization.getById(organizationId);
		const image = await this.repos.image.getDefault(params.type.at(0) || PointOfInterestTypeEnum.HistoricSite);
		if (!image) throw new Error('An image could not be found associated with this type.');

		const status = isAdmin ? data.status || PublishStatusEnum.Draft : PublishStatusEnum.Draft;

		const pointOfInterest = new PointOfInterest({
			...data,
			status,
			country,
			region,
			establishedYear,
			organization,
			image,
		});

		this.repos.pointOfInterest.persist(pointOfInterest);

		await this.flush();

		return {success: true, id: pointOfInterest.id, countryName: country.name, regionName: region.name, poiName: pointOfInterest.name};
	}
}
