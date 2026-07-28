import {Params, Response, RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';
import {config} from '../../config';

type Route<M extends keyof ROUTES['system']['StatusController']> = RouteDefinition<'system', 'StatusController'>[M];

export class StatusController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}

	public getStatus(params: Params<Route<'getStatus'>>): Response<Route<'getStatus'>> {
		let upgradeRequired = false;
		console.log(params);

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
}
