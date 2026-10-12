import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {Organization} from '../entities/Organization';

type Route<M extends keyof ROUTES['location']['OrganizationController']> = RouteDefinition<'location', 'OrganizationController'>[M];

export class OrganizationController extends BaseController {
	private permissionService = new PermissionService();

	constructor(repos: Repositories) {
		super(repos);
	}

	async getById(params: Params<Route<'getById'>>): Promise<Response<Route<'getById'>>> {
		const {id} = params;
		return this.repos.organization.getById(id);
	}

	async getAll(params?: Params<Route<'getAll'>>): Promise<Response<Route<'getAll'>>> {
		const regionId = params?.regionId || params?.id;
		if (regionId) {
			return this.repos.organization.getByRegion(regionId);
		}
		return this.repos.organization.getAll();
	}

	async getByRegionId(params: Params<Route<'getByRegionId'>>): Promise<Response<Route<'getByRegionId'>>> {
		return this.repos.organization.getByRegion(params.id);
	}

	public async create(params: Params<Route<'create'>>, auth?: AuthContext): Promise<Response<Route<'create'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		if (!params.name || !params.name.trim()) {
			throw new Error('Organization name is required');
		}

		const organization = new Organization({
			name: params.name.trim(),
		});

		const regionIds = params.regionIds || (params.regionId ? [params.regionId] : []);
		if (regionIds.length > 0) {
			const regions = await this.repos.region.find({id: {$in: regionIds}});
			for (const region of regions) {
				organization.regions.add(region);
			}
		}

		this.persist(organization);
		await this.flush();

		return {
			id: organization.id,
			name: organization.name,
		};
	}

	public async edit(params: Params<Route<'edit'>>, auth?: AuthContext): Promise<Response<Route<'edit'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		if (!params.id) {
			throw new Error('Organization ID is required');
		}
		if (!params.name || !params.name.trim()) {
			throw new Error('Organization name is required');
		}

		const organization = await this.repos.organization.getById(params.id);
		organization.name = params.name.trim();

		await organization.regions.init();
		organization.regions.removeAll();

		const regionIds = params.regionIds || (params.regionId ? [params.regionId] : []);
		if (regionIds.length > 0) {
			const regions = await this.repos.region.find({id: {$in: regionIds}});
			for (const region of regions) {
				organization.regions.add(region);
			}
		}

		await this.flush();

		return {
			id: organization.id,
			name: organization.name,
		};
	}
}
