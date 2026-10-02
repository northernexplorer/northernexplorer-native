import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../services/PermisionService';
import {BaseController} from '../../core/BaseController';

type Route<M extends keyof ROUTES['user']['SessionController']> = RouteDefinition<'user', 'SessionController'>[M];

export class SessionController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	private permissionService = new PermissionService();

	async getByUsername(params: Params<Route<'getByUsername'>>, auth?: AuthContext): Promise<Response<Route<'getByUsername'>>> {
		const user = await this.repos.user.getByUsername(params.username);
		this.permissionService.canAccessProfile({targetId: user.id}, auth);

		const sessions = await this.repos.session.getByUser(user);

		let activeTokenHash: string | null = null;
		if (params.refreshToken) {
			activeTokenHash = this.repos.session.hashToken(params.refreshToken);
		}

		return sessions
			.map(session => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const {refreshTokenHash, ...sessionData} = session;
				return {
					...sessionData,
					active: activeTokenHash === session.refreshTokenHash,
				};
			})
			.sort((a, b) => Number(b.active) - Number(a.active));
	}

	async deleteById(params: Params<Route<'deleteById'>>, auth?: AuthContext): Promise<Response<Route<'deleteById'>>> {
		const session = await this.repos.session.getById(params.sessionId);

		this.permissionService.canAccessProfile({targetId: session.user.id}, auth);

		await this.repos.session.delete(session);
		await this.flush();

		return {success: true};
	}
}
