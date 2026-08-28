import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['system']['SupportController']> = RouteDefinition<'system', 'SupportController'>[M];

export class SupportController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public async getByUrl(params: Params<Route<'getByUrl'>>): Promise<Response<Route<'getByUrl'>>> {
		const {url} = params;
		return this.repos.support.getByUrl(url);
	}

	getAll(): Promise<Response<Route<'getAll'>>> {
		return this.repos.support.getAll();
	}
}
