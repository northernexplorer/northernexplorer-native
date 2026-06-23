import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import ormConfig from './mikro-orm.config';
import { config } from './config';
import { CityController } from './City';
import { WeatherController } from './Weather';
import { ForecastController } from './Forecast';
import { FieldNoteController } from './FieldNote';
import { HistoricSiteController } from './HistoricSite';
import { LunarController } from './Lunar';
import { validateCoords } from './validateCoords';
import { EndpointType } from '@northernexplorer/types';
import path from 'node:path';

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
    app.get(`/api/${EndpointType.City}`, validateCoords, CityController.getCityData);
    app.get(`/api/${EndpointType.Weather}`, validateCoords, WeatherController.getWeatherData);
    app.get(`/api/${EndpointType.Forecast}`, validateCoords, ForecastController.getForecastData);
    app.get(`/api/${EndpointType.FieldNote}`, validateCoords, FieldNoteController.getFieldNoteData);
    app.get(
      `/api/${EndpointType.HistoricSites}`,
      validateCoords,
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
