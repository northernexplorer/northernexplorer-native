import { ROUTES, GetParams, GetResponse, NonEmptyCategory } from '@northernexplorer/types';
import { config } from '~/config';

export interface ApiMethod<P = unknown, R = unknown, E = string> {
  params: P;
  response: R;
  endpoint: E;
}
export type RouteNode<
  C extends NonEmptyCategory,
  K extends keyof ROUTES[C],
  M extends keyof ROUTES[C][K],
> = ROUTES[C][K][M] extends ApiMethod<infer P, infer R, infer E> ? ApiMethod<P, R, E> : ApiMethod;

export async function apiClient<
  C extends NonEmptyCategory,
  K extends keyof ROUTES[C],
  M extends keyof ROUTES[C][K],
>(
  category: C,
  controller: K,
  method: M,
  params: GetParams<C, K, M>,
): Promise<GetResponse<C, K, M>> {
  // Use the RouteNode to get the exact type of the method definition
  const route = ROUTES[category][controller][method] as unknown as ApiMethod;
  const endpoint = route.endpoint;

  const url = new URL(`${config.SERVER_URL}${endpoint}`);

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`API fetch failed [${String(method)}]: ${res.status}`);
  }
  return res.json() as Promise<GetResponse<C, K, M>>;
}
