import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {config} from '../../config';
import {AuthContext} from '../../index';
import {PermissionService} from '../../user/services/PermisionService';

type Route<M extends keyof ROUTES['system']['StatusController']> = RouteDefinition<'system', 'StatusController'>[M];

export class StatusController extends BaseController {
	private permissionService = new PermissionService();

	constructor(repos: Repositories) {
		super(repos);
	}

	public getStatus(params: Params<Route<'getStatus'>>): Response<Route<'getStatus'>> {
		let upgradeRequired = false;

		if (params.androidVersion && config.REQUIRED_ANDROID_VERSION) {
			if (parseInt(params.androidVersion, 10) < Number(config.REQUIRED_ANDROID_VERSION)) {
				upgradeRequired = true;
			}
		}

		if (params.iosVersion && config.REQUIRED_IOS_VERSION) {
			if (parseInt(params.iosVersion, 10) < Number(config.REQUIRED_IOS_VERSION)) {
				upgradeRequired = true;
			}
		}

		return {online: true, upgradeRequired};
	}

	async getOverview(params: Params<Route<'getOverview'>>, auth?: AuthContext): Promise<Response<Route<'getOverview'>>> {
		this.permissionService.canAccessAdmin({
			userId: auth?.userId,
			roles: auth?.roles,
		});

		const users = await this.repos.user.count({});
		const historicSites = await this.repos.historicSite.count({});
		return {
			users,
			historicSites,
		};
	}
}
