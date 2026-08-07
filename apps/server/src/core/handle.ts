import {Request, Response} from 'express';
import {RequestContext} from '@mikro-orm/core';
import {EntityManager} from '@mikro-orm/postgresql';
import {TokenService} from '../user/services/TokenService';
import {repositories, Repositories} from './repositories';
import {getClientIp} from './getClientIp';
import {AuthContext} from './types';

type ControllerConstructor<T> = new (repos: Repositories) => T;
const tokenService = new TokenService();

export function handle<T extends object>(ControllerClass: ControllerConstructor<T>, methodName: keyof T & string) {
	return async (req: Request, res: Response): Promise<void> => {
		const em = RequestContext.getEntityManager()! as EntityManager;
		const repos = repositories(em);
		const controller = new ControllerClass(repos);

		const method = (controller as Record<string, unknown>)[methodName];

		if (typeof method !== 'function') {
			throw new Error(`Method ${methodName} is not a function.`);
		}

		let currentUser: AuthContext | undefined = {ipAddress: getClientIp(req)};
		const authHeader = req.headers.authorization;

		if (authHeader?.startsWith('Bearer ')) {
			try {
				const token = authHeader.substring(7);
				const decodedToken = tokenService.verifyAccessToken(token);
				const user = await repos.user.getById(decodedToken.userId);
				currentUser = {...currentUser, ...decodedToken, roles: user.roles};
			} catch {
				res.status(401).json({error: 'Session Expired'});
				return;
			}
		}

		const secretHeader = authHeader?.match(/^secret\s+(.+)$/i)?.[1]?.trim() || (req.headers['secret'] as string) || req.body?.secret;

		const params = {
			...req.query,
			...req.params,
			...req.body,
			secret: secretHeader,
		};

		try {
			const result = await (method as (p: unknown, ctx: unknown) => Promise<unknown>).call(controller, params, currentUser);

			if (result !== undefined && !res.headersSent) {
				res.json(result);
			}
		} catch (error: unknown) {
			if (!res.headersSent) {
				const message = error instanceof Error ? error.message : String(error || '');

				if (message.includes('Unauthorized') || message.includes('must be logged in')) {
					res.status(401).json({error: message});
					return;
				}
				if (message.includes('Forbidden') || message.includes('permission to view')) {
					res.status(403).json({error: message});
					return;
				}

				res.status(500).json({error: message || 'Internal Server Error'});
			}
		}
	};
}
