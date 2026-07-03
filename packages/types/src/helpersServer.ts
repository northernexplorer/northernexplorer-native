import { ROUTES } from './routes';

export type RouteDefinition<C extends keyof ROUTES, K extends keyof ROUTES[C]> = ROUTES[C][K];

export type Params<T> = T extends { params: infer P } ? P : never;
export type Response<T> = T extends { response: infer R } ? R : never;
