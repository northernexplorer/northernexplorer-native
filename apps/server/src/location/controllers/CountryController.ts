import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from "../../core/BaseController";

type Route<M extends keyof ROUTES['location']['CountryController']> = RouteDefinition<'location', 'CountryController'>[M];

export class CountryController extends BaseController {
    constructor(repos: Repositories) {
        super(repos);
    }

	public async getCountryById(params: Params<Route<'getCountryById'>>): Promise<Response<Route<'getCountryById'>>> {
		const {id} = params;
		return this.repos.country.getCountryById(id);
	}
}
