import { Repositories } from '../../core/repositories';
import { Params, Response, RouteDefinition, ROUTES } from '@northernexplorer/types';
import { TokenService } from '../services/TokenService';

type Route<M extends keyof ROUTES['user']['UserController']> = RouteDefinition<
    'user',
    'UserController'
>[M];

export class UserController {
    constructor(private repos: Repositories) {}

    private tokenService = new TokenService();

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

        const isPasswordValid = await this.repos.user.checkPassword(
            params.password,
            user.passwordHash,
        );
        if (!isPasswordValid) {
            throw new Error('Invalid identifier or password');
        }

        user.lastLoginAt = new Date();
        await this.repos.user.getEntityManager().flush();

        const accessToken = this.tokenService.generateAccessToken({
            userId: user.id,
            email: user.email,
        });

        const refreshToken = this.tokenService.generateRefreshToken({
            userId: user.id,
        });

        return {
            userId: user.id,
            email: user.email,
            username: user.userName,
            accessToken,
            refreshToken,
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
        return this.repos.user.getById(params.id);
    }

    async refresh(params: Params<Route<'refresh'>>): Promise<Response<Route<'refresh'>>> {
        const payload = this.tokenService.verifyRefreshToken(params.refreshToken);
        if (!payload || !payload.userId) {
            throw new Error('Invalid refresh token');
        }

        const user = await this.repos.user.getById(payload.userId);
        if (!user) {
            throw new Error('User associated with this token no longer exists');
        }

        user.lastLoginAt = new Date();
        await this.repos.user.getEntityManager().flush();

        const accessToken = this.tokenService.generateAccessToken({
            userId: user.id,
            email: user.email,
        });

        const refreshToken = this.tokenService.generateRefreshToken({
            userId: user.id,
        });

        return {
            userId: user.id,
            email: user.email,
            username: user.userName,
            accessToken,
            refreshToken,
        };
    }
}
