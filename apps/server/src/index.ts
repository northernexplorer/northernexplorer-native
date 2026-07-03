import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
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
import { EndpointType } from '@northernexplorer/types';
import path from 'node:path';
import { validateCoordinates } from '@northernexplorer/tools';
import { createRepositories } from './core/createRepositories';
import { Repositories } from './core/typeHelpers';

const app = express();
const PORT = config.PORT;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

type DataReturningMethod = (
  req: Request,
  res: Response,
  next: NextFunction,
) => unknown | Promise<unknown>;

export function handle<T extends Record<K, DataReturningMethod>, K extends keyof T>(
  ControllerClass: new (repos: Repositories) => T,
  method: K,
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const em = RequestContext.getEntityManager()! as EntityManager;
      const repos = createRepositories(em);
      const controller = new ControllerClass(repos);

      const result = await controller[method](req, res, next);

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

    app.get(
      `/api/${EndpointType.City}`,
      validateCoordinates,
      handle(CityController, 'getCityData'),
    );
    app.get(
      `/api/${EndpointType.Weather}`,
      validateCoordinates,
      handle(WeatherController, 'getWeatherData'),
    );
    app.get(
      `/api/${EndpointType.Forecast}`,
      validateCoordinates,
      handle(ForecastController, 'getForecastData'),
    );
    app.get(
      `/api/${EndpointType.FieldNote}`,
      validateCoordinates,
      handle(FieldNoteController, 'getFieldNoteData'),
    );
    app.get(
      `/api/${EndpointType.HistoricSites}`,
      validateCoordinates,
      handle(HistoricSiteController, 'getNearbyHistoricSites'),
    );
    app.get(
      `/api/${EndpointType.HistoricSiteDetails}`,
      handle(HistoricSiteController, 'getHistoricSiteById'),
    );
    app.get(`/api/${EndpointType.Lunar}`, handle(LunarController, 'getLunarData'));

    app.listen(PORT, () => {
      console.log(`🚀 Northern Explorer API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize application data pool:', error);
    process.exit(1);
  }
}

bootstrap();
