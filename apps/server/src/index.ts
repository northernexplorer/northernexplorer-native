/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import path from 'node:path';
import express, {Request, Response} from 'express';
import cors from 'cors';
import {MikroORM, RequestContext} from '@mikro-orm/core';
import {EntityManager} from '@mikro-orm/postgresql';
import {ROUTES} from '@northernexplorer/types';
import {PgBoss} from 'pg-boss';
import ormConfig from './mikro-orm.config';
import {config} from './config';
import {repositories, Repositories} from './core/repositories';
import {controllers} from './core/controllers';
import {TokenService} from './user/services/TokenService';
import {heartbeats} from './core/heartbeats';
import {getClientIp} from './core/getClientIp';

const app = express();
const PORT = config.PORT;

const corsOrigin = config.CORS.split(',').map(origin => origin.toLowerCase().trim());

app.use(cors({origin: corsOrigin}));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

type ControllerConstructor<T> = new (repos: Repositories) => T;

const tokenService = new TokenService();

export interface AuthContext {
	userId?: string;
	email?: string;
	refreshToken?: string;
	ipAddress: string;
}

export function handle<T extends object>(ControllerClass: ControllerConstructor<any>, methodName: keyof T & string) {
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
				currentUser = {...currentUser, ...tokenService.verifyAccessToken(token)};
			} catch {
				res.status(401).json({error: 'Session Expired'});
				return;
			}
		}

		const params = {...req.query, ...req.params, ...req.body};

		try {
			const result = await (method as (p: unknown, ctx: unknown) => Promise<unknown>).call(controller, params, currentUser);

			if (result !== undefined && !res.headersSent) {
				res.json(result);
			}
		} catch (error: any) {
			if (!res.headersSent) {
				const message = error.message || '';

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

async function bootstrap() {
	try {
		const orm = await MikroORM.init(ormConfig);
		app.use((req, res, next) => RequestContext.create(orm.em, next));

		console.log('Initializing background job queue...');

		const boss = new PgBoss({
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT || '5432', 10),
			database: process.env.DB_NAME || 'northernexplorer',
			user: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASS || 'password',
		});
		await boss.start();

		console.log('Registering heartbeat background workers...');
		for (const HeartbeatClass of heartbeats) {
			const workerInstance = new HeartbeatClass();
			const queueName = (HeartbeatClass as any).queueName;
			const cronSchedule = (HeartbeatClass as any).queueSchedule || '0 */12 * * *';

			if (!queueName) {
				console.warn(`Skipping registration: ${HeartbeatClass.name} is missing a static "queueName" property.`);
				continue;
			}

			console.log(`Worker listening to queue: ${queueName}`);

			await boss.work(queueName, async () => {
				const dataEm = orm.em.fork() as EntityManager;
				const context = await workerInstance.getData(dataEm);

				if (Array.isArray(context)) {
					for (const contextItem of context) {
						// Fork a unique, lightweight Unit of Work context for processing this specific item
						const executionEm = orm.em.fork() as EntityManager;
						try {
							// Merge the entity into the execution context
							const managedItem = executionEm.merge(contextItem);

							// Cast workerInstance to 'any' to bypass compile-time signature collision.
							// At runtime, the types are guaranteed to match (User to CleanUsers, Subscription to RenewSubscription).
							await (workerInstance as any).execute(executionEm, managedItem);
							await executionEm.flush();
						} catch (entityError) {
							console.error(`[Queue: ${queueName}] Error processing individual item ${(contextItem as any).id || ''}:`, entityError);
						}
					}
				}
			});

			await boss.createQueue(queueName);

			console.log(`Scheduling queue ${queueName} with cron: ${cronSchedule}`);
			await boss.schedule(queueName, cronSchedule);
		}

		Object.entries(ROUTES).forEach(([, controllersObj]) => {
			Object.entries(controllersObj).forEach(([controllerName, methods]) => {
				const ControllerClass = controllers.find(c => c.name === controllerName);

				if (ControllerClass) {
					Object.entries(methods).forEach(([methodName]) => {
						const path = `/api/${ControllerClass.name}/${methodName}`;

						console.log(`Registering: ANY ${path}`);

						app.all(path, handle(ControllerClass, methodName as keyof InstanceType<typeof ControllerClass> & string));
					});
				}
			});
		});

		app.listen(PORT, () => {
			console.log(`API running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Failed to initialize:', error);
		process.exit(1);
	}
}

bootstrap();
