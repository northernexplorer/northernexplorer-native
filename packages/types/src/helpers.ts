import { ROUTES } from './routes';

export type NonEmptyCategory = {
  [K in keyof ROUTES]: ROUTES[K] extends Record<string, any>
    ? keyof ROUTES[K] extends never
      ? never
      : K
    : never;
}[keyof ROUTES];

export type GetParams<
  C extends NonEmptyCategory,
  Ctrl extends keyof ROUTES[C],
  M extends keyof ROUTES[C][Ctrl],
> = ROUTES[C][Ctrl][M] extends { params: infer P } ? P : never;

export type GetResponse<
  C extends NonEmptyCategory,
  Ctrl extends keyof ROUTES[C],
  M extends keyof ROUTES[C][Ctrl],
> = ROUTES[C][Ctrl][M] extends { response: infer R } ? R : never;

export type GetEndpoint<
  C extends NonEmptyCategory,
  Ctrl extends keyof ROUTES[C],
  M extends keyof ROUTES[C][Ctrl],
> = ROUTES[C][Ctrl][M] extends { endpoint: infer E } ? E : never;
