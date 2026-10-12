import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';
import {Country} from '../entities/Country';

type Route<M extends keyof ROUTES['location']['CountryController']> = RouteDefinition<'location', 'CountryController'>[M];

export class CountryController extends BaseController {
	private permissionService = new PermissionService();

	constructor(repos: Repositories) {
		super(repos);
	}

	public async getById(params: Params<Route<'getById'>>): Promise<Response<Route<'getById'>>> {
		const {id} = params;
		return this.repos.country.getById(id);
	}

	getAll(): Promise<Response<Route<'getAll'>>> {
		return this.repos.country.getAll();
	}

	public async create(params: Params<Route<'create'>>, auth?: AuthContext): Promise<Response<Route<'create'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		if (!params.name || !params.name.trim()) {
			throw new Error('Country name is required');
		}

		const country = new Country({
			name: params.name.trim(),
		});

		this.persist(country);
		await this.flush();

		return {
			id: country.id,
			name: country.name,
		};
	}

	public async edit(params: Params<Route<'edit'>>, auth?: AuthContext): Promise<Response<Route<'edit'>>> {
		this.permissionService.isLoggedIn(auth);
		this.permissionService.canAccessAdmin(auth);

		if (!params.id) {
			throw new Error('Country ID is required');
		}
		if (!params.name || !params.name.trim()) {
			throw new Error('Country name is required');
		}

		const country = await this.repos.country.getById(params.id);
		country.name = params.name.trim();

		await this.flush();

		return {
			id: country.id,
			name: country.name,
		};
	}
}
