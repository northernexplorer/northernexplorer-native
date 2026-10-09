import {Params, PointOfInterestSuggestionType, Response, RouteDefinition, ROUTES, SuggestionStatusEnum} from '@northernexplorer/types';
import {BaseController} from '../../core/BaseController';
import {Repositories} from '../../core/repositories';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {PointOfInterestSuggestion} from '../entities/PointOfInterestSuggestion';

type Route<M extends keyof ROUTES['location']['PointOfInterestSuggestionController']> = RouteDefinition<
	'location',
	'PointOfInterestSuggestionController'
>[M];

export class PointOfInterestSuggestionController extends BaseController {
	private permissionService = new PermissionService();

	constructor(repos: Repositories) {
		super(repos);
	}

	private formatSuggestion(suggestion: PointOfInterestSuggestion): PointOfInterestSuggestionType {
		return {
			id: suggestion.id,
			pointOfInterest: {
				id: suggestion.pointOfInterest.id,
				name: suggestion.pointOfInterest.name,
				description: suggestion.pointOfInterest.description,
				lat: suggestion.pointOfInterest.lat,
				lon: suggestion.pointOfInterest.lon,
				startDate: suggestion.pointOfInterest.startDate,
				endDate: suggestion.pointOfInterest.endDate,
				type: suggestion.pointOfInterest.type,
				country: {
					id: suggestion.pointOfInterest.country.id,
					name: suggestion.pointOfInterest.country.name,
				},
				region: {
					id: suggestion.pointOfInterest.region.id,
					name: suggestion.pointOfInterest.region.name,
				},
				organization: {
					id: suggestion.pointOfInterest.organization.id,
					name: suggestion.pointOfInterest.organization.name,
				},
				image: {
					id: suggestion.pointOfInterest.image.id,
					version: suggestion.pointOfInterest.image.version,
					url: suggestion.pointOfInterest.image.url,
					fileExtension: suggestion.pointOfInterest.image.fileExtension,
					filename: suggestion.pointOfInterest.image.filename,
					mimeType: suggestion.pointOfInterest.image.mimeType,
					processed: suggestion.pointOfInterest.image.processed,
					status: suggestion.pointOfInterest.image.status,
				},
			},
			user: {
				id: suggestion.user.id,
				username: suggestion.user.username,
				firstName: suggestion.user.firstName,
				lastName: suggestion.user.lastName,
				score: suggestion.user.score,
			},
			name: suggestion.name,
			description: suggestion.description,
			lat: suggestion.lat,
			lon: suggestion.lon,
			country: {
				id: suggestion.country.id,
				name: suggestion.country.name,
			},
			region: {
				id: suggestion.region.id,
				name: suggestion.region.name,
			},
			organization: {
				id: suggestion.organization.id,
				name: suggestion.organization.name,
			},
			image: suggestion.image
				? {
						id: suggestion.image.id,
						version: suggestion.image.version,
						url: suggestion.image.url,
						fileExtension: suggestion.image.fileExtension,
						filename: suggestion.image.filename,
						mimeType: suggestion.image.mimeType,
						processed: suggestion.image.processed,
						status: suggestion.image.status,
					}
				: undefined,
			startDate: suggestion.startDate,
			endDate: suggestion.endDate,
			type: suggestion.type,
			status: suggestion.status,
			createdAt: suggestion.createdAt,
			updatedAt: suggestion.updatedAt,
		};
	}

	public async create(params: Params<Route<'create'>>, auth?: AuthContext): Promise<Response<Route<'create'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		const user = await this.repos.user.getById(userId);
		const pointOfInterest = await this.repos.pointOfInterest.getById(params.pointOfInterestId);
		const country = await this.repos.country.getById(params.countryId);
		const region = await this.repos.region.getById(params.regionId);
		const organization = await this.repos.organization.getById(params.organizationId);

		const suggestion = new PointOfInterestSuggestion({
			user,
			pointOfInterest,
			name: params.name,
			description: params.description,
			lat: params.lat,
			lon: params.lon,
			country,
			region,
			organization,
			image: pointOfInterest.image,
			startDate: params.startDate,
			endDate: params.endDate,
			type: params.type,
			status: SuggestionStatusEnum.Pending,
		});

		this.persist(suggestion);
		await this.flush();

		return {success: true};
	}

	public async getPending(params: Params<Route<'getPending'>>, auth?: AuthContext): Promise<Response<Route<'getPending'>>> {
		this.permissionService.canAccessAdmin(auth);
		const suggestions = await this.repos.pointOfInterestSuggestion.getPending({
			limit: params.limit,
			offset: params.offset,
		});
		return suggestions.map(s => this.formatSuggestion(s));
	}

	public async getAll(params: Params<Route<'getAll'>>, auth?: AuthContext): Promise<Response<Route<'getAll'>>> {
		this.permissionService.canAccessAdmin(auth);
		const suggestions = await this.repos.pointOfInterestSuggestion.getAll({
			limit: params.limit,
			offset: params.offset,
			status: params.status,
		});
		return suggestions.map(s => this.formatSuggestion(s));
	}

	public async getById(params: Params<Route<'getById'>>, auth?: AuthContext): Promise<Response<Route<'getById'>>> {
		this.permissionService.canAccessAdmin(auth);
		const suggestion = await this.repos.pointOfInterestSuggestion.getByIdPopulated(params.id);
		return this.formatSuggestion(suggestion);
	}

	public async approve(params: Params<Route<'approve'>>, auth?: AuthContext): Promise<Response<Route<'approve'>>> {
		this.permissionService.canAccessAdmin(auth);
		const suggestion = await this.repos.pointOfInterestSuggestion.getByIdPopulated(params.id);
		const pointOfInterest = await this.repos.pointOfInterest.getById(suggestion.pointOfInterest.id);

		// Apply the suggested changes to pointOfInterest
		pointOfInterest.edit({
			name: suggestion.name,
			description: suggestion.description,
			lat: suggestion.lat,
			lon: suggestion.lon,
			country: suggestion.country,
			region: suggestion.region,
			organization: suggestion.organization,
			type: suggestion.type,
			startDate: suggestion.startDate,
			endDate: suggestion.endDate,
			image: suggestion.image || pointOfInterest.image,
		});

		suggestion.status = SuggestionStatusEnum.Approved;
		suggestion.updatedAt = new Date();
		suggestion.user.score = (suggestion.user.score || 0) + 10;

		await this.flush();
		return {success: true};
	}

	public async reject(params: Params<Route<'reject'>>, auth?: AuthContext): Promise<Response<Route<'reject'>>> {
		this.permissionService.canAccessAdmin(auth);
		const suggestion = await this.repos.pointOfInterestSuggestion.getByIdPopulated(params.id);
		suggestion.status = SuggestionStatusEnum.Rejected;
		suggestion.updatedAt = new Date();

		await this.flush();
		return {success: true};
	}
}
