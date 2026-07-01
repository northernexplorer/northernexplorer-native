import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { MikroORM, RequestContext } from '@mikro-orm/core';
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

const app = express();
const PORT = config.PORT;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'public')));

async function bootstrap() {
  try {
    // Pass the clean, un-evaluated database config object directly
    const orm = await MikroORM.init(ormConfig);

    // Fork transaction context
    app.use((req, res, next) => RequestContext.create(orm.em, next));

    // Router setup
    app.get(`/api/${EndpointType.City}`, validateCoordinates, CityController.getCityData);
    app.get(`/api/${EndpointType.Weather}`, validateCoordinates, WeatherController.getWeatherData);
    app.get(
      `/api/${EndpointType.Forecast}`,
      validateCoordinates,
      ForecastController.getForecastData,
    );
    app.get(
      `/api/${EndpointType.FieldNote}`,
      validateCoordinates,
      FieldNoteController.getFieldNoteData,
    );
    app.get(
      `/api/${EndpointType.HistoricSites}`,
      validateCoordinates,
      HistoricSiteController.getNearbyHistoricSites,
    );
    app.get(`/api/${EndpointType.HistoricSiteDetails}`, HistoricSiteController.getHistoricSiteById);
    app.get(`/api/${EndpointType.Lunar}`, LunarController.getLunarData);

    app.listen(PORT, () => {
      console.log(`🚀 Northern Explorer API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize application data pool:', error);
    process.exit(1);
  }
}

bootstrap();
