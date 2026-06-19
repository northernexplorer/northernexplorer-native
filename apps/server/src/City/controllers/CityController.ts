import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { CityCache } from '../entities/City.js';
import { config } from '../../config.js';

export class CityController {
  public static async getCityData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Coordinates were validated and attached by your validateCoords.ts
      const lat = res.locals.lat;
      const lon = res.locals.lon;

      const em = RequestContext.getEntityManager()!;

      // We drop down to raw SQL here to run the exact formula matching your PHP layer
      const sql = `
        SELECT city_data as cityData, updated_at as updatedAt,
               (6371000 * acos(
                   cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) +
                   sin(radians(?)) * sin(radians(lat))
               )) AS distance_meters
        FROM city_cache
        WHERE updated_at >= NOW() - INTERVAL 60 DAY
        HAVING distance_meters <= 5000
        ORDER BY distance_meters ASC
        LIMIT 1
      `;

      const rawResults = await em.getConnection().execute(sql, [lat, lon, lat]);
      const cachedResult = rawResults[0];

      if (cachedResult) {
        res.json({
          source: "database_cache",
          distance_offset: `${Math.round(cachedResult.distance_meters)} meters`,
          cached_at: cachedResult.updatedAt,
          // If your DB driver automatically parsed the text to json, return it; otherwise parse it
          data: typeof cachedResult.cityData === 'string' ? JSON.parse(cachedResult.cityData) : cachedResult.cityData
        });
        return;
      }

      const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${config.WEATHER_API_KEY}&q=${lat},${lon}`;

      const apiResponse = await fetch(apiUrl);

      if (!apiResponse.ok) {
        throw new Error(`WeatherAPI Geocoding API responded with code ${apiResponse.status}`);
      }

      const parsedJson = await apiResponse.json();

      // Save to cache table via MikroORM Entity Manager
      const newCacheEntry = em.create(CityCache, {
        lat: Number(lat),
        lon: Number(lon),
        cityData: parsedJson
      });

      em.persist(newCacheEntry);
      await em.flush();

      const cleanupSql = `DELETE FROM city_cache WHERE updated_at < NOW() - INTERVAL 90 DAY`;
      await em.getConnection().execute(cleanupSql);

      res.json({
        source: "weatherapi_data",
        data: parsedJson
      });

    } catch (error) {
      next(error);
    }
  }
}