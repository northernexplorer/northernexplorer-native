import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['location']['CountryController']> = RouteDefinition<'location', 'CountryController'>[M];

export class CountryController extends BaseController {
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
}
