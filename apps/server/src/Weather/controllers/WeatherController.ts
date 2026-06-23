import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { WeatherCache } from '../entities/WeatherCache.js';
import { config } from '../../config.js';

interface RawInternalWeatherRow {
  weatherData: string | Record<string, unknown>;
}

interface RawWeatherCacheRow {
  weatherData: string | Record<string, unknown>;
  updatedAt: Date;
  distanceMeters: number;
}

export class WeatherController {
  public static async getInternalWeatherData(
    lat: number,
    lon: number,
  ): Promise<Record<string, unknown> | null> {
    const em = RequestContext.getEntityManager()!;

    const query = `
        SELECT weather_data as "weatherData"
        FROM (
                 SELECT weather_data, updated_at,
                        (6371000 * acos( cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(lat)) )) AS distance_meters
                 FROM weather_cache
                 WHERE updated_at >= NOW() - INTERVAL '15 minutes'
             ) AS spatial_search
        WHERE distance_meters <= 2000
        ORDER BY distance_meters ASC
            LIMIT 1
    `;

    const rawResults = (await em
      .getConnection()
      .execute(query)) as unknown as RawInternalWeatherRow[];
    const cachedRecord = rawResults[0];

    if (cachedRecord) {
      return typeof cachedRecord.weatherData === 'string'
        ? (JSON.parse(cachedRecord.weatherData) as Record<string, unknown>)
        : (cachedRecord.weatherData as Record<string, unknown>);
    }

    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${config.WEATHER_API_KEY}&q=${encodeURIComponent(`${lat},${lon}`)}&aqi=no`;

    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      throw new Error(`WeatherAPI current endpoint responded with status ${apiResponse.status}`);
    }

    const parsedJson = (await apiResponse.json()) as Record<string, unknown>;

    const freshCacheEntry = em.create(WeatherCache, {
      lat,
      lon,
      weatherData: parsedJson,
    });
    em.persist(freshCacheEntry);
    await em.flush();

    // FIXED: Wrapped the interval value in standard Postgres quotes
    const cleanupQuery = `DELETE FROM weather_cache WHERE updated_at < NOW() - INTERVAL '24 hours'`;
    await em.getConnection().execute(cleanupQuery);

    return parsedJson;
  }

  public static async getWeatherData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const lat = res.locals.lat;
      const lon = res.locals.lon;
      const em = RequestContext.getEntityManager()!;

      const query = `
                SELECT weather_data as "weatherData", updated_at as "updatedAt", distance_meters as "distanceMeters"
                FROM (
                         SELECT weather_data, updated_at,
                                (6371000 * acos( cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(lat)) )) AS distance_meters
                         FROM weather_cache
                         WHERE updated_at >= NOW() - INTERVAL '15 minutes'
                     ) AS spatial_search
                WHERE distance_meters <= 2000
                ORDER BY distance_meters ASC
                    LIMIT 1
            `;

      const rawResults = (await em
        .getConnection()
        .execute(query)) as unknown as RawWeatherCacheRow[];
      const cachedResult = rawResults[0];

      if (cachedResult) {
        res.json({
          source: 'database_cache',
          distance_offset: `${Math.round(cachedResult.distanceMeters)} meters`,
          cached_at: cachedResult.updatedAt,
          data:
            typeof cachedResult.weatherData === 'string'
              ? JSON.parse(cachedResult.weatherData)
              : cachedResult.weatherData,
        });
        return;
      }

      const freshData = await WeatherController.getInternalWeatherData(lat, lon);

      res.json({
        source: 'weatherapi_data',
        data: freshData,
      });
    } catch (error) {
      next(error);
    }
  }
}
