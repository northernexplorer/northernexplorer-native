import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {Region} from '../entities/Region';

type Route<M extends keyof ROUTES['location']['RegionController']> = RouteDefinition<'location', 'RegionController'>[M];

export class RegionController extends BaseController {
	private permissionService = new PermissionService();

	constructor(repos: Repositories) {
		super(repos);
	}

	public async getById(params: Params<Route<'getById'>>): Promise<Response<Route<'getById'>>> {
		const {id} = params;
		const region = await this.repos.region.getById(id);
		return {
			id: region.id,
			name: region.name,
			countryId: region.country.id,
			country: {
				id: region.country.id,
				name: region.country.name,
			},
		};
	}

	async getByCountryId(params: Params<Route<'getByCountryId'>>): Promise<Response<Route<'getByCountryId'>>> {
		const country = await this.repos.country.getById(params.id);
		return this.repos.region.getByCountry(country);
	}

	public async create(params: Params<Route<'create'>>, auth?: AuthContext): Promise<Response<Route<'create'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		if (!params.name || !params.name.trim()) {
			throw new Error('Region name is required');
		}
		if (!params.countryId) {
			throw new Error('Country ID is required');
		}

		const country = await this.repos.country.getById(params.countryId);
		const region = new Region({
			name: params.name.trim(),
			country,
		});

		this.persist(region);
		await this.flush();

		return {
			id: region.id,
			name: region.name,
			countryId: country.id,
			country: {
				id: country.id,
				name: country.name,
			},
		};
	}

	public async edit(params: Params<Route<'edit'>>, auth?: AuthContext): Promise<Response<Route<'edit'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		if (!params.id) {
			throw new Error('Region ID is required');
		}
		if (!params.name || !params.name.trim()) {
			throw new Error('Region name is required');
		}
		if (!params.countryId) {
			throw new Error('Country ID is required');
		}

		const region = await this.repos.region.getById(params.id);
		const country = await this.repos.country.getById(params.countryId);

		region.name = params.name.trim();
		region.country = country;

		await this.flush();

		return {
			id: region.id,
			name: region.name,
			countryId: country.id,
			country: {
				id: country.id,
				name: country.name,
			},
		};
	}
}
