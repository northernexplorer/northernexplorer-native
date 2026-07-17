import {Repositories} from '../../core/repositories';
import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {AuthContext} from '../../index';
import {PermissionService} from '../services/PermisionService';

type Route<M extends keyof ROUTES['user']['SessionController']> = RouteDefinition<'user', 'SessionController'>[M];

export class SessionController {
	private permissionService = new PermissionService();

	constructor(private repos: Repositories) {}

	async getSessions(params: Params<Route<'getSessions'>>, auth?: AuthContext): Promise<Response<Route<'getSessions'>>> {
		const user = await this.repos.user.getByUsername(params.username);
		this.permissionService.canAccessProfile({
			userId: auth?.userId,
			targetId: user.id,
		});

		const sessions = await this.repos.session.getByUser(user);

		let activeTokenHash: string | null = null;
		if (params.refreshToken) {
			activeTokenHash = await this.repos.session.hashToken(params.refreshToken);
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
}
