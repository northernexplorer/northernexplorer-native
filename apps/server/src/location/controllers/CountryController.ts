import { Repositories } from '../../core/repositories';
import { Params, Response, RouteDefinition, ROUTES } from '@northernexplorer/types';

type Route<M extends keyof ROUTES['location']['CountryController']> = RouteDefinition<
    'location',
    'CountryController'
>[M];

export class CountryController {
    constructor(private repos: Repositories) {}

    public async getCountryById(
        params: Params<Route<'getCountryById'>>,
    ): Promise<Response<Route<'getCountryById'>>> {
        const { id } = params;
        return this.repos.country.getCountryById(id);
    }
}
