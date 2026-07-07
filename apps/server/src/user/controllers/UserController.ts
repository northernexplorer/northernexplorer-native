import { Repositories } from '../../core/repositories';
import { Params, Response, RouteDefinition, ROUTES } from '@northernexplorer/types';

type Route<M extends keyof ROUTES['user']['UserController']> = RouteDefinition<
    'user',
    'UserController'
>[M];

export class UserController {
    constructor(private repos: Repositories) {}

    async register(params: Params<Route<'register'>>): Promise<Response<Route<'register'>>> {}
    async login(params: Params<Route<'login'>>): Promise<Response<Route<'login'>>> {}
    async forgotPassword(
        params: Params<Route<'forgotPassword'>>,
    ): Promise<Response<Route<'forgotPassword'>>> {}
    async editProfile(
        params: Params<Route<'editProfile'>>,
    ): Promise<Response<Route<'editProfile'>>> {}
    async changePassword(
        params: Params<Route<'changePassword'>>,
    ): Promise<Response<Route<'changePassword'>>> {}
    async getById(params: Params<Route<'getById'>>): Promise<Response<Route<'getById'>>> {}
}
