import { Repositories } from '../../core/repositories';
import { Params, Response, RouteDefinition, ROUTES } from '@northernexplorer/types';

type Route<M extends keyof ROUTES['user']['UserController']> = RouteDefinition<
    'user',
    'UserController'
>[M];

export class UserController {
    constructor(private repos: Repositories) {}

    async register(params: Params<Route<'register'>>): Promise<Response<Route<'register'>>> {
        const passwordHash = await this.repos.user.hashPassword(params.password);

        this.repos.user.create({
            email: params.email,
            firstName: params.firstName,
            lastLoginAt: new Date(),
            lastName: params.lastName,
            userName: params.userName,
            createdAt: new Date(),
            isActive: true,
            passwordHash,
            version: 1,
        });
        await this.repos.user.getEntityManager().flush();
        return { success: true };
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
