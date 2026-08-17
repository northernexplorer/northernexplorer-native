import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {wrap} from '@mikro-orm/core';
import {Repositories} from '../../core/repositories';
import {TokenService} from '../services/TokenService';
import {PermissionService} from '../services/PermisionService';
import {EmailSendService} from '../../system/services/EmailSendService';
import {config} from '../../config';
import {AuthContext} from '../../core/types';
import {BaseController} from '../../core/BaseController';
import {Subscription} from '../entities/Subscription';
import {User} from '../entities/User';
import {Session} from '../entities/Session';

type Route<M extends keyof ROUTES['user']['UserController']> = RouteDefinition<'user', 'UserController'>[M];

export class UserController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	private tokenService = new TokenService();
	private permissionService = new PermissionService();
	private emailSendService = new EmailSendService();

	async register(params: Params<Route<'register'>>): Promise<Response<Route<'register'>>> {
		if (params.website) throw new Error('Form submission failed. Please try again.');

		const existingUserWithEmail = await this.repos.user.findByIdentifier(params.email.toLowerCase());
		if (existingUserWithEmail) throw new Error('This email address is already in use.');

		const existingUserWithUsername = await this.repos.user.findByIdentifier(params.username.toLowerCase());
		if (existingUserWithUsername) throw new Error('This username is already taken.');

		await this.repos.user.passwordValidation({
			password: params.password,
			confirmPassword: params.confirmPassword,
		});
		const passwordHash = await this.repos.user.hashPassword(params.password);

		const subscriptionLevel = await this.repos.subscriptionLevel.getByName('Pathfinder');

		const subscription = new Subscription({subscriptionLevel});
		this.persist(subscription);

		const user = new User({
			email: params.email.toLowerCase(),
			firstName: params.firstName,
			lastName: params.lastName,
			username: params.username.toLowerCase(),
			birthday: params.birthday,
			gender: params.gender,
			isActive: false,
			passwordHash,
			subscription,
		});

		this.persist(user);
		await this.flush();

		const activationToken = this.tokenService.generateToken({userId: user.id, email: user.email.toLowerCase()}, 'account_activation');
		const activationUrl = `${config.WEB_URL}/profile/activate?token=${activationToken}`;

		await this.emailSendService.send({
			to: user.email.toLowerCase(),
			subject: 'Northern Explorer: Welcome',
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

	async login(params: Params<Route<'login'>>, auth?: AuthContext): Promise<Response<Route<'login'>>> {
		const user = await this.repos.user.findByIdentifier(params.login.identifier.toLowerCase());
		if (!user) throw new Error("We couldn't find an account matching that information.");
		if (!user.isActive) throw new Error("Your account isn't active yet. Please check your email for the activation link.");

		const isPasswordValid = await this.repos.user.checkPassword(params.login.password, user.passwordHash);
		if (!isPasswordValid) throw new Error('Incorrect password. Please try again or tap forgot password to reset it.');

		const accessToken = this.tokenService.generateAccessToken({
			userId: user.id,
			email: user.email.toLowerCase(),
		});

		const refreshToken = this.tokenService.generateRefreshToken({
			userId: user.id,
		});

		const refreshTokenHash = this.repos.session.hashToken(refreshToken);

		const {exp} = this.tokenService.verifyRefreshToken(refreshToken);

		const session = new Session({
			expiresAt: new Date(exp! * 1000),
			ipAddress: auth?.ipAddress || '',
			firstLoginAt: new Date(),
			lastLoginAt: new Date(),
			refreshTokenHash,
			user,
			clientName: params.device.clientName,
			osName: params.device.osName,
			platform: params.device.platform,
		});

		this.persist(session);
		await this.flush();

		return {
			userId: user.id,
			email: user.email.toLowerCase(),
			username: user.username.toLowerCase(),
			roles: user.roles,
			accessToken,
			refreshToken,
		};
	}

	async logout(params: Params<Route<'logout'>>): Promise<Response<Route<'logout'>>> {
		const refreshTokenHash = this.repos.session.hashToken(params.refreshToken);
		const session = await this.repos.session.getByRefreshHash(refreshTokenHash);
		if (session) {
			await this.repos.session.delete(session);
		}
		return {success: true};
	}

	async forgotPassword(params: Params<Route<'forgotPassword'>>): Promise<Response<Route<'forgotPassword'>>> {
		const user = await this.repos.user.findByIdentifier(params.email.toLowerCase());
		if (!user) throw new Error("We couldn't find an account matching that information.");
		if (!user.isActive) throw new Error("Your account isn't active yet. Please check your email for the activation link.");

		const resetPasswordToken = this.tokenService.generateToken({userId: user.id, email: user.email.toLowerCase()}, 'password_reset');
		const resetPasswordUrl = `${config.WEB_URL}/profile/reset-password?token=${resetPasswordToken}`;

		await this.emailSendService.send({
			to: user.email.toLowerCase(),
			subject: 'Northern Explorer: Password Reset',
			html: `
               <h1>Reset your password</h1>
               <p>We received a request to reset your password. Click the button below to proceed:</p>
               <a href="${resetPasswordUrl}" style="background: #0088cc; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                 Reset Password
               </a>
               <p>If you did not request this, please ignore this email.</p>
               <p><em>This link will expire in 24 hours.</em></p>
             `,
		});

		return {success: true};
	}

	async editProfile(params: Params<Route<'editProfile'>>, auth?: AuthContext): Promise<Response<Route<'editProfile'>>> {
		const {targetId} = this.permissionService.canAccessProfile({targetId: params.userId}, auth);
		const user = await this.repos.user.getById(targetId);

		await this.repos.user.update(user.id, params);
		await this.flush();
		return {success: true};
	}

	async changePassword(params: Params<Route<'changePassword'>>, auth?: AuthContext): Promise<Response<Route<'changePassword'>>> {
		const user = await this.repos.user.getByUsername(params.username.toLowerCase());
		this.permissionService.canAccessProfile({targetId: user.id}, auth);

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

		await this.flush();

		return {
			success: true,
		};
	}

	async getByUsername(params: Params<Route<'getByUsername'>>, auth?: AuthContext): Promise<Response<Route<'getByUsername'>>> {
		const user = await this.repos.user.getByUsername(params.username.toLowerCase());
		this.permissionService.canAccessProfile({targetId: user.id}, auth);

		const safeUser = wrap(user).toObject();
		delete (safeUser as Partial<typeof safeUser>).passwordHash;

		return safeUser;
	}

	async refresh(params: Params<Route<'refresh'>>): Promise<Response<Route<'refresh'>>> {
		const payload = this.tokenService.verifyRefreshToken(params.refreshToken);
		if (!payload.userId) throw new Error('Your session has expired. Please log in again.');

		const refreshHash = this.repos.session.hashToken(params.refreshToken);
		const session = await this.repos.session.getByRefreshHash(refreshHash);
		if (!session) throw new Error('Your session has expired.');

		const user = await this.repos.user.getById(payload.userId);

		const accessToken = this.tokenService.generateAccessToken({userId: user.id, email: user.email.toLowerCase()});
		const newRefreshToken = this.tokenService.generateRefreshToken({userId: user.id});
		const newRefreshHash = this.repos.session.hashToken(newRefreshToken);

		session.refreshTokenHash = newRefreshHash;
		session.lastLoginAt = new Date();

		await this.flush();

		return {
			userId: user.id,
			email: user.email.toLowerCase(),
			username: user.username.toLowerCase(),
			accessToken,
			refreshToken: newRefreshToken,
			roles: user.roles,
		};
	}

	async activate(params: Params<Route<'activate'>>, auth?: AuthContext): Promise<Response<Route<'activate'>>> {
		const {userId} = this.tokenService.verifyToken(params.activationToken);

		const user = await this.repos.user.getById(userId);
		if (user.isActive) throw new Error('This account is already active. Try logging in!');

		user.isActive = true;
		await this.flush();

		const accessToken = this.tokenService.generateAccessToken({
			userId: user.id,
			email: user.email.toLowerCase(),
		});

		const refreshToken = this.tokenService.generateRefreshToken({
			userId: user.id,
		});

		const refreshTokenHash = this.repos.session.hashToken(refreshToken);

		const {exp} = this.tokenService.verifyRefreshToken(refreshToken);

		const session = new Session({
			expiresAt: new Date(exp! * 1000),
			ipAddress: auth?.ipAddress || '',
			firstLoginAt: new Date(),
			lastLoginAt: new Date(),
			refreshTokenHash,
			user,
			clientName: params.device.clientName,
			osName: params.device.osName,
			platform: params.device.platform,
		});
		this.persist(session);
		await this.flush();

		return {
			userId: user.id,
			email: user.email.toLowerCase(),
			username: user.username.toLowerCase(),
			accessToken,
			refreshToken,
			roles: user.roles,
		};
	}

	async resetPassword(params: Params<Route<'resetPassword'>>): Promise<Response<Route<'resetPassword'>>> {
		const {userId} = this.tokenService.verifyToken(params.token);

		const user = await this.repos.user.getById(userId);
		if (!user.isActive) throw new Error("Your account isn't active yet. Please check your email for the activation link.");

		await this.repos.user.passwordValidation({
			password: params.newPassword,
			confirmPassword: params.confirmPassword,
		});

		const passwordHash = await this.repos.user.hashPassword(params.newPassword);

		wrap(user).assign({
			passwordHash,
		});

		await this.flush();

		return {
			success: true,
		};
	}

	async deleteUser(params: Params<Route<'deleteUser'>>, auth?: AuthContext): Promise<Response<Route<'deleteUser'>>> {
		const user = await this.repos.user.getByUsername(params.username.toLowerCase());
		this.permissionService.canAccessProfile({targetId: user.id}, auth);

		const subscription = await this.repos.subscription.getById(user.subscription.id);
		const sessions = await this.repos.session.getByUser(user);

		if (sessions.length > 0) {
			await this.repos.session.nativeDelete({id: {$in: sessions.map(s => s.id)}});
		}
		await this.repos.user.nativeDelete({id: user.id});
		await this.repos.subscription.nativeDelete({id: subscription.id});

		await this.flush();

		return {
			success: true,
		};
	}

	getAll(params: Params<Route<'getAll'>>, auth?: AuthContext): Promise<Response<Route<'getAll'>>> {
		this.permissionService.canAccessAdmin(auth);
		return this.repos.user.getAll();
	}
}
