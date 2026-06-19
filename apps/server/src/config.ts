import dotenv from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { City } from './City';
import { ForecastCache } from './Forecast';
import { HistoricSite } from './HistoricSite';
import { WeatherCache } from './Weather';

dotenv.config();

export const config = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,

    db: defineConfig({
        host: process.env.DB_HOST || 'localhost',
        dbName: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        entities: [City, ForecastCache, HistoricSite, WeatherCache],
        debug: process.env.NODE_ENV !== 'production',
    })
};