import {Repositories} from '../../core/repositories';
import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {TokenPayload, TokenService} from '../services/TokenService';
import {wrap} from '@mikro-orm/core';
import {PermissionService} from '../services/PermisionService';
import {EmailSendService} from '../../system/services/EmailSendService';
import {config} from '../../config';

type Route<M extends keyof ROUTES['user']['UserController']> = RouteDefinition<'user', 'UserController'>[M];

export class UserController {
	private tokenService = new TokenService();
	private permissionService = new PermissionService();
	private emailSendService = new EmailSendService();

	constructor(private repos: Repositories) {}

	async register(params: Params<Route<'register'>>): Promise<Response<Route<'register'>>> {
		if (params.website) throw new Error('Forbidden: Bot activity detected.');
		const existingUserWithEmail = await this.repos.user.findByIdentifier(params.email);
		if (existingUserWithEmail) throw new Error('An account with this email address already exists.');
		const existingUserWithUsername = await this.repos.user.findByIdentifier(params.username);
		if (existingUserWithUsername) throw new Error('An account with this username already exists.');
		await this.repos.user.passwordValidation({
			password: params.password,
			confirmPassword: params.confirmPassword,
		});
		const passwordHash = await this.repos.user.hashPassword(params.password);

		const subscriptionLevel = await this.repos.subscriptionLevel.getById(1);

		const startDate = new Date();
		const renewalDate = new Date();
		renewalDate.setMonth(startDate.getMonth() + 1);

		const subscription = this.repos.subscription.create({
			subscriptionLevel,
			version: 1,
			startDate,
			renewalDate,
		});

		const user = this.repos.user.create({
			email: params.email,
			firstName: params.firstName,
			lastLoginAt: new Date(),
			lastName: params.lastName,
			username: params.username,
			createdAt: new Date(),
			isActive: false,
			passwordHash,
			version: 1,
			subscription,
		});
		await this.repos.user.getEntityManager().flush();

		const activationToken = this.tokenService.generateActivationToken({userId: user.id, email: user.email});
		const activationUrl = `${config.WEB_URL}/profile/activate?token=${activationToken}`;

		await this.emailSendService.send({
			to: user.email,
			subject: 'Welcome to Northern Explorer!',
			html: `
			  <h1>Welcome to Northern Explorer!</h1>
			  <p>Please click the button below to activate your account and start exploring:</p>
			  <a href="${activationUrl}" style="background: #0088cc; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
				 Activate Account
			  </a>
			  <p>Or copy and paste this link into your browser:</p>
			  <p>${activationUrl}</p>
			  <p><em>This link will expire in 24 hours.</em></p>
		   `,
		});

		return {success: true};
	}

	async login(params: Params<Route<'login'>>): Promise<Response<Route<'login'>>> {
		const user = await this.repos.user.findByIdentifier(params.identifier);
		if (!user) throw new Error('A user with this identifier does not exist.');
		if (!user.isActive) throw new Error('This user is not active. Please check your email for the activation link.');

		const isPasswordValid = await this.repos.user.checkPassword(params.password, user.passwordHash);
		if (!isPasswordValid) throw new Error('This password is not valid. Please try again or reset your password if you have forgotten it.');

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
		return {success: true};
	}

	async forgotPassword(params: Params<Route<'forgotPassword'>>): Promise<Response<Route<'forgotPassword'>>> {
		const user = await this.repos.user.findByIdentifier(params.email);
		if (!user) throw new Error('A user with this identifier does not exist.');
		if (!user.isActive) throw new Error('This user is not active. Please check your email for the activation link.');
		console.log('Forgot password', params);
		throw new Error('Not implemented');
		return {success: true};
	}

	async editProfile(params: Params<Route<'editProfile'>>, auth?: TokenPayload): Promise<Response<Route<'editProfile'>>> {
		const {targetId} = this.permissionService.canAccessProfile({
			userId: auth?.userId,
			targetId: params.userId,
		});
		const user = await this.repos.user.getById(targetId);

		await this.repos.user.update(user.id, params);
		return {success: true};
	}

	async changePassword(params: Params<Route<'changePassword'>>, auth?: TokenPayload): Promise<Response<Route<'changePassword'>>> {
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

	async getByUsername(params: Params<Route<'getByUsername'>>, auth?: TokenPayload): Promise<Response<Route<'getByUsername'>>> {
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
		if (!payload || !payload.userId) throw new Error('Invalid refresh token');

		const user = await this.repos.user.getById(payload.userId);

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

	async activate(params: Params<Route<'activate'>>): Promise<Response<Route<'activate'>>> {
		const {userId} = await this.tokenService.verifyActivationToken(params.activationToken);

		const user = await this.repos.user.getById(userId);
		if (!user) throw new Error('A user with this identifier does not exist.');
		if (user.isActive) throw new Error('This user account has already been activated.');

		user.isActive = true;
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
