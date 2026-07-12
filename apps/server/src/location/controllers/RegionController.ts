import { Repositories } from '../../core/repositories';
import { Params, Response, RouteDefinition, ROUTES } from '@northernexplorer/types';

type Route<M extends keyof ROUTES['location']['RegionController']> = RouteDefinition<
    'location',
    'RegionController'
>[M];

export class RegionController {
    constructor(private repos: Repositories) {}

    public async getRegionById(
        params: Params<Route<'getRegionById'>>,
    ): Promise<Response<Route<'getRegionById'>>> {
        const { id } = params;
        return this.repos.region.getRegionById(id);
    }
}
