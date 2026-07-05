import { Repositories } from '../../core/repositories';
import { Response, RouteDefinition, ROUTES } from '@northernexplorer/types';

type Route<M extends keyof ROUTES['system']['StatusController']> = RouteDefinition<
  'system',
  'StatusController'
>[M];

export class StatusController {
  constructor(private repos: Repositories) {}

  public async getOnlineStatus(): Promise<Response<Route<'getOnlineStatus'>>> {
    return true;
  }
}
