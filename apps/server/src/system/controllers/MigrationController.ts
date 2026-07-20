import {RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';
import {BaseController} from '../../core/BaseController';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Route<M extends keyof ROUTES['system']['MigrationController']> = RouteDefinition<'system', 'MigrationController'>[M];

export class MigrationController extends BaseController {
	constructor(repos: Repositories) {
		super(repos);
	}
}
