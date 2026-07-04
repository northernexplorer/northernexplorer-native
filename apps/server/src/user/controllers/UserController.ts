import { Repositories } from '../../core/repositories';
import { RouteDefinition, ROUTES } from '@northernexplorer/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Route<M extends keyof ROUTES['user']['UserController']> = RouteDefinition<
  'user',
  'UserController'
>[M];

export class UserController {
  constructor(private repos: Repositories) {}
}
