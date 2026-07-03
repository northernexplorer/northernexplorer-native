import 'reflect-metadata';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import cors from 'cors';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import ormConfig from './mikro-orm.config';
import { config } from './config';
import {
  ForecastController,
  FieldNoteController,
  LunarController,
  WeatherController,
} from './environment';
import { CityController, HistoricSiteController } from './location';
import { ROUTES } from '@northernexplorer/types';
import path from 'node:path';
import { validateCoordinates } from '@northernexplorer/tools';
import { createRepositories } from './core/createRepositories';
import { Repositories } from './core/typeHelpers';

const app = express();
const PORT = config.PORT;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

export function handle<T extends object>(
  ControllerClass: new (repos: Repositories) => T,
  methodName: keyof T & string,
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const em = RequestContext.getEntityManager()! as EntityManager;
      const repos = createRepositories(em);
      const controller = new ControllerClass(repos);

      // Access the method
      const method = (controller as Record<string, unknown>)[methodName];

      if (typeof method !== 'function') {
        throw new Error(`Method ${methodName} is not a function.`);
      }

      const params = { ...req.query, ...req.params };

      const result = await (method as (p: unknown) => Promise<unknown>).call(controller, params);

      if (result !== undefined && !res.headersSent) {
        res.json(result);
      }
    } catch (error) {
      next(error);
    }
  };
}

async function bootstrap() {
  try {
    const orm = await MikroORM.init(ormConfig);
    app.use((req, res, next) => RequestContext.create(orm.em, next));

    const register = (
      route: string,
      middleware: RequestHandler[],
      handler: ReturnType<typeof handle>,
    ) => app.get(`/api/${route}`, ...middleware, handler);

    register(
      ROUTES.location.CityController.getCityData.endpoint,
      [validateCoordinates],
      handle(CityController, 'getCityData'),
    );
    register(
      ROUTES.environment.WeatherController.getWeatherData.endpoint,
      [validateCoordinates],
      handle(WeatherController, 'getWeatherData'),
    );
    register(
      ROUTES.environment.ForecastController.getForecastData.endpoint,
      [validateCoordinates],
      handle(ForecastController, 'getForecastData'),
    );
    register(
      ROUTES.environment.FieldNoteController.getFieldNoteData.endpoint,
      [validateCoordinates],
      handle(FieldNoteController, 'getFieldNoteData'),
    );
    register(
      ROUTES.location.HistoricSiteController.getNearbyHistoricSites.endpoint,
      [validateCoordinates],
      handle(HistoricSiteController, 'getNearbyHistoricSites'),
    );
    register(
      ROUTES.location.HistoricSiteController.getHistoricSiteById.endpoint,
      [],
      handle(HistoricSiteController, 'getHistoricSiteById'),
    );
    register(
      ROUTES.environment.LunarController.getLunarData.endpoint,
      [],
      handle(LunarController, 'getLunarData'),
    );

    app.listen(PORT, () => {
      console.log(`🚀 Northern Explorer API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize:', error);
    process.exit(1);
  }
}

bootstrap();
