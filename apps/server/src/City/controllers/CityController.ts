import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { CityCache } from '../entities/CityCache';
import { config } from '../../config.js';

export class CityController {
  public static async getCityData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Coordinates were validated and attached by your validateCoords.ts
      const lat = res.locals.lat;
      const lon = res.locals.lon;

      const em = RequestContext.getEntityManager()!;

      const query = `
          SELECT city_data as "cityData", updated_at as "updatedAt", distance_meters as "distanceMeters"
          FROM (
                   SELECT city_data, updated_at,
                          (6371000 * acos( cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(lat)) )) AS distance_meters
                   FROM city_cache
                   WHERE updated_at >= NOW() - INTERVAL '60 days'
               ) AS search_results
          WHERE distance_meters <= 5000
          ORDER BY distance_meters ASC
              LIMIT 1
      `;

      const rawResults = await em.getConnection().execute(query, [lat, lon, lat]);
      const cachedResult = rawResults[0];

      if (cachedResult) {
        res.json({
          source: 'database_cache',
          distance_offset: `${Math.round(cachedResult.distance_meters)} meters`,
          cached_at: cachedResult.updatedAt,
          // If your DB driver automatically parsed the text to json, return it; otherwise parse it
          data:
            typeof cachedResult.cityData === 'string'
              ? JSON.parse(cachedResult.cityData)
              : cachedResult.cityData,
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
        cityData: parsedJson,
      });

      em.persist(newCacheEntry);
      await em.flush();

      const cleanupQuery = `DELETE FROM city_cache WHERE updated_at < NOW() - INTERVAL 90 DAY`;
      await em.getConnection().execute(cleanupQuery);

      res.json({
        source: 'weatherapi_data',
        data: parsedJson,
      });
    } catch (error) {
      next(error);
    }
  }
}
