import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { WeatherCache } from '../entities/WeatherCache';
import { config } from '../../config.js';

export class WeatherController {

  /**
   * Internal Data Provider - Shared with FieldNoteController
   * Returns only the raw weather API data layer, bypassing the metadata wrapper.
   */
  public static async getInternalWeatherData(lat: number, lon: number): Promise<any | null> {
    const em = RequestContext.getEntityManager()!;

    // 1. Spatial cache check (under 2000m, under 15 minutes old) using ST_Distance_Sphere
    const sql = `
      SELECT weather_data as weatherData
      FROM (
          SELECT weather_data, updated_at,
                 ST_Distance_Sphere(POINT(lon, lat), POINT(?, ?)) AS distance_meters
          FROM weather_cache
          WHERE updated_at >= NOW() - INTERVAL 15 MINUTE
      ) AS spatial_search
      WHERE distance_meters <= 2000
      ORDER BY distance_meters ASC
      LIMIT 1
    `;

    const rawResults = await em.getConnection().execute(sql, [lon, lat]);
    const cachedRecord = rawResults[0];

    if (cachedRecord) {
      return typeof cachedRecord.weatherData === 'string'
        ? JSON.parse(cachedRecord.weatherData)
        : cachedRecord.weatherData;
    }

    // 2. Cache Miss: Fetch fresh payload from WeatherAPI
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${config.WEATHER_API_KEY}&q=${encodeURIComponent(`${lat},${lon}`)}&aqi=no`;

    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      throw new Error(`WeatherAPI current endpoint responded with status ${apiResponse.status}`);
    }

    const parsedJson = await apiResponse.json();

    // 3. Persist fresh data back to the database cache
    const freshCacheEntry = em.create(WeatherCache, {
      lat,
      lon,
      weatherData: parsedJson
    });
    em.persist(freshCacheEntry);
    await em.flush();

    // 4. Housekeeping cleanup routine (Stale rows > 24 hours deleted)
    const cleanupSql = `DELETE FROM weather_cache WHERE updated_at < NOW() - INTERVAL 24 HOUR`;
    await em.getConnection().execute(cleanupSql);

    return parsedJson;
  }

  /**
   * Public HTTP API Route Handler
   * Re-queries or computes the payload while appending provenance metadata hooks for your client app.
   */
  public static async getWeatherData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lat = res.locals.lat;
      const lon = res.locals.lon;
      const em = RequestContext.getEntityManager()!;

      // Check the cache natively to extract distance metadata for the API contract
      const sql = `
        SELECT weather_data as weatherData, updated_at as updatedAt, distance_meters as distanceMeters
        FROM (
            SELECT weather_data, updated_at,
                   ST_Distance_Sphere(POINT(lon, lat), POINT(?, ?)) AS distance_meters
            FROM weather_cache
            WHERE updated_at >= NOW() - INTERVAL 15 MINUTE
        ) AS spatial_search
        WHERE distance_meters <= 2000
        ORDER BY distance_meters ASC
        LIMIT 1
      `;

      const rawResults = await em.getConnection().execute(sql, [lon, lat]);
      const cachedResult = rawResults[0];

      if (cachedResult) {
        res.json({
          source: "database_cache",
          distance_offset: `${Math.round(cachedResult.distanceMeters)} meters`,
          cached_at: cachedResult.updatedAt,
          data: typeof cachedResult.weatherData === 'string' ? JSON.parse(cachedResult.weatherData) : cachedResult.weatherData
        });
        return;
      }

      // If no cache, fall back to our internal fetch pipeline
      const freshData = await WeatherController.getInternalWeatherData(lat, lon);

      res.json({
        source: "weatherapi_data",
        data: freshData
      });

    } catch (error) {
      next(error);
    }
  }
}