import 'reflect-metadata';
import { defineConfig } from '@mikro-orm/postgresql';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import dotenv from 'dotenv';

import { CityCache } from './City';
import { ForecastCache } from './Forecast';
import { HistoricSite } from './HistoricSite';
import { WeatherCache } from './Weather';

dotenv.config();

export default defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  dbName: process.env.DB_NAME || 'northernexplorer',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  metadataProvider: ReflectMetadataProvider,
  entities: [CityCache, ForecastCache, HistoricSite, WeatherCache],
  debug: process.env.NODE_ENV !== 'production',
});