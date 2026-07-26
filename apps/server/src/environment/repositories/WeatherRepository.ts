import {EntityRepository} from '@mikro-orm/postgresql';
import {WeatherCache} from '../entities/WeatherCache';
import {config} from '../../config';

interface RawInternalWeatherRow {
	weatherData: string | Record<string, unknown>;
}

export class WeatherRepository extends EntityRepository<WeatherCache> {
	async getWeatherCache(lat: number, lon: number) {
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

		const rawResults = (await this.em.getConnection().execute(query)) as unknown as RawInternalWeatherRow[];

		const cachedRecord = rawResults.at(0);
		if (cachedRecord) {
			return typeof cachedRecord.weatherData === 'string' ? JSON.parse(cachedRecord.weatherData) : cachedRecord.weatherData;
		}

		const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${config.WEATHER_API_KEY}&q=${encodeURIComponent(`${lat},${lon}`)}&aqi=no`;

		const apiResponse = await fetch(apiUrl);
		if (!apiResponse.ok) {
			throw new Error(`WeatherAPI current endpoint responded with status ${apiResponse.status}`);
		}

		const parsedJson = (await apiResponse.json()) as Record<string, unknown>;

		await this.createCache(lat, lon, parsedJson);

		return parsedJson;
	}

	async createCache(lat: number, lon: number, parsedJson: Record<string, unknown>) {
		const weatherCache = new WeatherCache({
			lat,
			lon,
			weatherData: parsedJson,
			updatedAt: new Date(),
		});
		this.em.persist(weatherCache);

		await this.nativeDelete({
			updatedAt: {$lte: new Date(Date.now() - 1000 * 60 * 60 * 3)},
		});
	}
}
