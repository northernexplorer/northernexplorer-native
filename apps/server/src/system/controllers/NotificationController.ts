import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {AuthContext} from '../../core/types';
import {PermissionService} from '../../user/services/PermisionService';

type Route<M extends keyof ROUTES['system']['NotificationController']> = RouteDefinition<'system', 'NotificationController'>[M];

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export class NotificationController extends BaseController {
	private permissionService = new PermissionService();

	constructor(repos: Repositories) {
		super(repos);
	}

	async getAllPaginated(params: Params<Route<'getAllPaginated'>>, auth?: AuthContext): Promise<Response<Route<'getAllPaginated'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		const requestedLimit = Number.isFinite(params.limit) ? Math.floor(params.limit!) : DEFAULT_PAGE_SIZE;
		const requestedOffset = Number.isFinite(params.offset) ? Math.floor(params.offset!) : 0;
		const limit = Math.min(Math.max(requestedLimit, 1), MAX_PAGE_SIZE);
		const offset = Math.max(requestedOffset, 0);

		const [notifications, totalCount] = await Promise.all([
			this.repos.notification.getForUser({userId, limit, offset}),
			this.repos.notification.countForUser(userId),
		]);

		return {
			items: notifications.map(notification => ({
				id: notification.id,
				title: notification.title,
				message: notification.message,
				link: notification.link,
				createdAt: notification.createdAt,
				readAt: notification.readAt,
			})),
			totalCount,
		};
	}

	async getUnreadStatus(params: Params<Route<'getUnreadStatus'>>, auth?: AuthContext): Promise<Response<Route<'getUnreadStatus'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		return {hasUnread: await this.repos.notification.hasUnreadForUser(userId)};
	}

	async markRead(params: Params<Route<'markRead'>>, auth?: AuthContext): Promise<Response<Route<'markRead'>>> {
		const {userId} = this.permissionService.isLoggedIn(auth);
		const notification = await this.repos.notification.getByIdForUser(params.id, userId);

		if (!notification.readAt) {
			notification.readAt = new Date();
		}

		await this.flush();
		return {success: true};
	}
}
