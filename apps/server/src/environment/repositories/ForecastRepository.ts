import { ForecastCache } from '../entities/ForecastCache';
import { EntityRepository } from '@mikro-orm/postgresql';
import { config } from '../../config';

interface RawInternalForecastRow {
  forecastData: string | Record<string, unknown>;
}

export class ForecastRepository extends EntityRepository<ForecastCache> {
  async getForecastCache(lat: number, lon: number) {
    const query = `
      SELECT forecast_data as "forecastData", updated_at as "updatedAt", distance_meters as "distanceMeters"
      FROM (
             SELECT forecast_data, updated_at,
                    (6371000 * acos( cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(lat)) )) AS distance_meters
             FROM forecast_cache
             WHERE updated_at >= NOW() - INTERVAL '3 hours'
           ) AS search_results
      WHERE distance_meters <= 3000
      ORDER BY distance_meters ASC
        LIMIT 1
    `;

    const rawResults = (await this.em
      .getConnection()
      .execute(query)) as unknown as RawInternalForecastRow[];

    const cachedResult = rawResults[0];

    if (cachedResult) {
      const parsedData =
        typeof cachedResult.forecastData === 'string'
          ? JSON.parse(cachedResult.forecastData)
          : cachedResult.forecastData;

      return parsedData;
    }

    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${config.WEATHER_API_KEY}&q=${encodeURIComponent(`${lat},${lon}`)}&days=7&aqi=no`;

    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      throw new Error(`WeatherAPI Forecast API responded with code ${apiResponse.status}`);
    }

    const parsedJson = (await apiResponse.json()) as Record<string, unknown>;

    await this.createCache(lat, lon, parsedJson);

    return parsedJson;
  }

  async createCache(lat: number, lon: number, parsedJson: Record<string, unknown>) {
    const freshCacheEntry = this.em.create(ForecastCache, {
      lat,
      lon,
      forecastData: parsedJson,
    });
    this.em.persist(freshCacheEntry);

    await this.em.nativeDelete(ForecastCache, {
      updatedAt: { $lte: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    });
    await this.em.flush();
  }
}
