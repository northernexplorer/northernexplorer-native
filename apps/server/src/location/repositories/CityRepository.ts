import { CityCache } from '../entities/CityCache';
import { EntityRepository } from '@mikro-orm/postgresql';
import { config } from '../../config';

export class CityRepository extends EntityRepository<CityCache> {
  async getCityCache(lat: number, lon: number) {
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

    const rawResults = await this.em.getConnection().execute(query, [lat, lon, lat]);
    const cachedResult = rawResults[0];

    if (cachedResult) {
      return cachedResult;
    }

    const apiUrl = `https://api.weatherapi.com/v1/search.json?key=${config.WEATHER_API_KEY}&q=${lat},${lon}`;

    const apiResponse = await fetch(apiUrl);

    if (!apiResponse.ok) {
      throw new Error(`WeatherAPI Geocoding API responded with code ${apiResponse.status}`);
    }

    const parsedJson = await apiResponse.json();

    await this.createCache(lat, lon, parsedJson);
    return parsedJson;
  }

  async createCache(lat: number, lon: number, parsedJson: Record<string, unknown>) {
    const newCacheEntry = this.create({
      lat: Number(lat),
      lon: Number(lon),
      cityData: parsedJson,
      updatedAt: new Date(),
    });

    this.em.persist(newCacheEntry);

    await this.nativeDelete({
      updatedAt: { $lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90) },
    });
    await this.em.flush();
  }
}
