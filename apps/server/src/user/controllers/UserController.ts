import { Repositories } from '../../core/repositories';
import { Params, Response, RouteDefinition, ROUTES } from '@northernexplorer/types';

type Route<M extends keyof ROUTES['user']['UserController']> = RouteDefinition<
    'user',
    'UserController'
>[M];

export class UserController {
    constructor(private repos: Repositories) {}

    async register(params: Params<Route<'register'>>): Promise<Response<Route<'register'>>> {
        const user = await this.repos.user.create(params);
        return {
            userId: user.id,
            email: user.email,
            username: user.userName,
            accessToken: '...',
            refreshToken: '...',
        };
    }

    async login(params: Params<Route<'login'>>): Promise<Response<Route<'login'>>> {
        const user = await this.repos.user.findByIdentifier(params.identifier);
        if (!user) throw new Error('User does not exist');

        return {
            userId: user.id,
            email: user.email,
            username: user.userName,
            accessToken: '...',
            refreshToken: '...',
        };
    }

    async forgotPassword(
        params: Params<Route<'forgotPassword'>>,
    ): Promise<Response<Route<'forgotPassword'>>> {
        await this.repos.user.requestPasswordReset(params.email);
        return { success: true };
    }

    async editProfile(
        params: Params<Route<'editProfile'>>,
    ): Promise<Response<Route<'editProfile'>>> {
        await this.repos.user.update(params.userId, params);
        return true;
    }

    async changePassword(
        params: Params<Route<'changePassword'>>,
    ): Promise<Response<Route<'changePassword'>>> {}

    async getById(params: Params<Route<'getById'>>): Promise<Response<Route<'getById'>>> {
        const user = await this.repos.user.getById(params.id);
        return { user };
    }
}
