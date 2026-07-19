import {RouteDefinition, ROUTES} from '@northernexplorer/types';
import {Repositories} from '../../core/repositories';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Route<M extends keyof ROUTES['system']['MigrationController']> = RouteDefinition<'system', 'MigrationController'>[M];

export class MigrationController {
	constructor(private repos: Repositories) {}
}
