/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import ormConfig from './mikro-orm.config';
import { config } from './config';
import { ROUTES } from '@northernexplorer/types';
import path from 'node:path';
import { repositories, Repositories } from './core/repositories';
import { controllers } from './core/controllers';
import { TokenService } from './user/services/TokenService';

const app = express();
const PORT = config.PORT;

app.use(cors({ origin: '*' }));
app.use(express.json()); // This parses the incoming JSON, but we need to extract it below
app.use(express.static(path.join(process.cwd(), 'public')));

type ControllerConstructor<T> = new (repos: Repositories) => T;

const tokenService = new TokenService();

export function handle<T extends object>(
    ControllerClass: ControllerConstructor<any>,
    methodName: keyof T & string,
) {
    return async (req: Request, res: Response): Promise<void> => {
        const em = RequestContext.getEntityManager()! as EntityManager;
        const repos = repositories(em);
        const controller = new ControllerClass(repos);

        const method = (controller as Record<string, unknown>)[methodName];

        if (typeof method !== 'function') {
            throw new Error(`Method ${methodName} is not a function.`);
        }

        let currentUser: unknown = undefined;
        const authHeader = req.headers.authorization;

        if (authHeader?.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                currentUser = tokenService.verifyAccessToken(token);
            } catch {
                res.status(401).json({ error: 'Unauthorized: Token has expired or is invalid' });
            }
        }

        const params = { ...req.query, ...req.params, ...req.body };

        try {
            const result = await (method as (p: unknown, ctx: unknown) => Promise<unknown>).call(
                controller,
                params,
                currentUser,
            );

            if (result !== undefined && !res.headersSent) {
                res.json(result);
            }
        } catch (error: any) {
            if (!res.headersSent) {
                const message = error.message || '';

                if (message.includes('Unauthorized') || message.includes('must be logged in')) {
                    res.status(401).json({ error: message });
                    return;
                }
                if (message.includes('Forbidden') || message.includes('permission to view')) {
                    res.status(403).json({ error: message });
                    return;
                }

                res.status(500).json({ error: message || 'Internal Server Error' });
            }
        }
    };
}

async function bootstrap() {
    try {
        const orm = await MikroORM.init(ormConfig);
        app.use((req, res, next) => RequestContext.create(orm.em, next));

        Object.entries(ROUTES).forEach(([, controllersObj]) => {
            Object.entries(controllersObj).forEach(([controllerName, methods]) => {
                const ControllerClass = controllers.find((c) => c.name === controllerName);

                if (ControllerClass) {
                    Object.entries(methods).forEach(([methodName, routeConfig]) => {
                        const { endpoint } = routeConfig as { endpoint: string };
                        const path = `/api/${endpoint}`;

                        console.log(`Registering: ANY ${path}`);

                        app.all(
                            path,
                            handle(
                                ControllerClass,
                                methodName as keyof InstanceType<typeof ControllerClass> & string,
                            ),
                        );
                    });
                }
            });
        });

        app.listen(PORT, () => {
            console.log(`🚀 API running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to initialize:', error);
        process.exit(1);
    }
}

bootstrap();
