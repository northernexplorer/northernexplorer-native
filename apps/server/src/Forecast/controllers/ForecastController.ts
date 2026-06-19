import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { ForecastCache } from '../entities/ForecastCache';
import { config } from '../../config.js';

export class ForecastController {
  public static async getForecastData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lat = res.locals.lat;
      const lon = res.locals.lon;
      const em = RequestContext.getEntityManager()!;

      // 1. Check cache using the Haversine Formula inside a subquery (3-hour cache window)
      const query = `
        SELECT forecast_data as forecastData, updated_at as updatedAt, distance_meters as distanceMeters
        FROM (
            SELECT forecast_data, updated_at,
                   (6371000 * acos(
                       cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) +
                       sin(radians(?)) * sin(radians(lat))
                   )) AS distance_meters
            FROM forecast_cache
            WHERE updated_at >= NOW() - INTERVAL '3 HOUR'
        ) AS search_results
        WHERE distance_meters <= 3000
        ORDER BY distance_meters ASC
        LIMIT 1
      `;

      const rawResults = await em.getConnection().execute(query, [lat, lon, lat]);
      const cachedResult = rawResults[0];

      if (cachedResult) {
        res.json({
          source: "database_cache",
          distance_offset: `${Math.round(cachedResult.distanceMeters)} meters`,
          cached_at: cachedResult.updatedAt,
          data: typeof cachedResult.forecastData === 'string' ? JSON.parse(cachedResult.forecastData) : cachedResult.forecastData
        });
        return;
      }

      // 2. Cache Miss: Fetch fresh forecast from WeatherAPI
      const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${config.WEATHER_API_KEY}&q=${encodeURIComponent(`${lat},${lon}`)}&days=5`;

      const apiResponse = await fetch(apiUrl);
      if (!apiResponse.ok) {
        throw new Error(`WeatherAPI Forecast API responded with code ${apiResponse.status}`);
      }

      const parsedJson = await apiResponse.json();

      // 3. Save to cache table via MikroORM
      const newCacheEntry = em.create(ForecastCache, {
        lat,
        lon,
        forecastData: parsedJson
      });
      em.persist(newCacheEntry);
      await em.flush();

      // 4. Housekeeping: Purge stale records older than 24 hours
      const cleanupQuery = `DELETE FROM forecast_cache WHERE updated_at < NOW() - INTERVAL '24 HOUR'`;
      await em.getConnection().execute(cleanupQuery);

      res.json({
        source: "weatherapi_data",
        data: parsedJson
      });

    } catch (error) {
      next(error);
    }
  }
}