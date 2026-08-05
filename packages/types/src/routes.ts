import {location} from './location';
import {environment} from './environment';
import {user} from './user';
import {system} from './system';
export interface ApiMethod<P = unknown, R = unknown> {
	params: P;
	response: R;
}

export type ControllerDefinition = Record<string, ApiMethod>;

export type CategoryDefinition = Record<string, ControllerDefinition>;

export interface RouteSchema {
	[category: string]: CategoryDefinition;
}

export const ROUTES = {
	environment,
	location,
	system,
	user,
} as const satisfies RouteSchema;

export type ROUTES = typeof ROUTES;
