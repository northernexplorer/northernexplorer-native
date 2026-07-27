import {EntityRepository} from '@mikro-orm/postgresql';
import {CityCache} from '../entities/CityCache';
import {config} from '../../config';

export class CityRepository extends EntityRepository<CityCache> {
	async getCityCache(lat: number, lon: number) {
		const query = `
			SELECT city_data as "cityData", updated_at as "updatedAt", distance_meters as "distanceMeters"
			FROM (
					 SELECT city_data, updated_at,
				            (6371000 * acos(
								cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) +
					            sin(radians(?)) * sin(radians(lat))
				                       )) AS distance_meters
				     FROM city_cache
				     WHERE updated_at >= NOW() - INTERVAL '60 days'
				 ) AS search_results
			WHERE distance_meters <= 5000
			ORDER BY distance_meters ASC
				LIMIT 1
		`;

		const cachedResults = await this.em.getConnection().execute(query, [lat, lon, lat]);
		const cachedResult = cachedResults.at(0);

		if (cachedResult) {
			return typeof cachedResult.cityData === 'string' ? JSON.parse(cachedResult.cityData)[0] : cachedResult.cityData[0];
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
		const cityCache = new CityCache({
			lat: Number(lat),
			lon: Number(lon),
			cityData: parsedJson,
			updatedAt: new Date(),
		});

		this.em.persist(cityCache);

		await this.nativeDelete({
			updatedAt: {$lte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)},
		});
	}
}
