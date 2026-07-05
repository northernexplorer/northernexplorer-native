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

const app = express();
const PORT = config.PORT;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

type ControllerConstructor<T> = new (repos: Repositories) => T;

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

        const params = { ...req.query, ...req.params };

        const result = await (method as (p: unknown) => Promise<unknown>).call(controller, params);

        if (result !== undefined && !res.headersSent) {
            res.json(result);
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

                        console.log(`Registering: GET ${path}`);

                        app.get(
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
