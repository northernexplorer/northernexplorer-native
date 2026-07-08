import { Repositories } from '../../core/repositories';
import { Params, Response, RouteDefinition, ROUTES } from '@northernexplorer/types';
import { TokenPayload, TokenService } from '../services/TokenService';
import { wrap } from '@mikro-orm/core';
import { PermissionService } from '../services/PermisionService';

type Route<M extends keyof ROUTES['user']['UserController']> = RouteDefinition<
    'user',
    'UserController'
>[M];

export class UserController {
    constructor(private repos: Repositories) {}

    private tokenService = new TokenService();
    private permissionService = new PermissionService();

    async register(params: Params<Route<'register'>>): Promise<Response<Route<'register'>>> {
        if (params.website) throw new Error('Forbidden: Bot activity detected.');
        await this.repos.user.passwordValidation({
            password: params.password,
            confirmPassword: params.confirmPassword,
        });
        const passwordHash = await this.repos.user.hashPassword(params.password);

        this.repos.user.create({
            email: params.email,
            firstName: params.firstName,
            lastLoginAt: new Date(),
            lastName: params.lastName,
            username: params.username,
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
            username: user.username,
            accessToken,
            refreshToken,
        };
    }

    async logout(params: Params<Route<'logout'>>): Promise<Response<Route<'logout'>>> {
        //todo clear refresh token
        console.log('Logout', params);
        return { success: true };
    }

    async forgotPassword(
        params: Params<Route<'forgotPassword'>>,
    ): Promise<Response<Route<'forgotPassword'>>> {
        console.log('Forgot password', params);
        throw new Error('Not implemented');
        return { success: true };
    }

    async editProfile(
        params: Params<Route<'editProfile'>>,
        auth?: TokenPayload,
    ): Promise<Response<Route<'editProfile'>>> {
        const { targetId } = this.permissionService.canAccessProfile({
            userId: auth?.userId,
            targetId: params.userId,
        });
        const user = await this.repos.user.getById(targetId);

        await this.repos.user.update(user.id, params);
        return { success: true };
    }

    async changePassword(
        params: Params<Route<'changePassword'>>,
        auth?: TokenPayload,
    ): Promise<Response<Route<'changePassword'>>> {
        const user = await this.repos.user.getByUsername(params.username);
        this.permissionService.canAccessProfile({
            userId: auth?.userId,
            targetId: user.id,
        });

        await this.repos.user.passwordValidation({
            password: params.newPassword,
            confirmPassword: params.confirmPassword,
            oldPassword: params.currentPassword,
            currentHash: user.passwordHash,
        });

        const passwordHash = await this.repos.user.hashPassword(params.newPassword);

        wrap(user).assign({
            passwordHash,
        });

        await this.repos.user.getEntityManager().flush();

        return {
            success: true,
        };
    }

    async getByUsername(
        params: Params<Route<'getByUsername'>>,
        auth?: TokenPayload,
    ): Promise<Response<Route<'getByUsername'>>> {
        const user = await this.repos.user.getByUsername(params.username);
        this.permissionService.canAccessProfile({
            userId: auth?.userId,
            targetId: user.id,
        });

        const safeUser = wrap(user).toObject();
        delete (safeUser as Partial<typeof safeUser>).passwordHash;

        return safeUser;
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
            username: user.username,
            accessToken,
            refreshToken,
        };
    }
}
