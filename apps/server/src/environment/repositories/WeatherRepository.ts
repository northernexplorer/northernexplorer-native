import {WeatherWarningType} from '@northernexplorer/types';
import {BaseRepository} from '../../core/BaseRepository';
import {WeatherCache} from '../entities/WeatherCache';
import {WeatherWarningCache} from '../entities/WeatherWarningCache';
import {config} from '../../config';

interface RawInternalWeatherRow {
	weatherData: string | Record<string, unknown>;
}

interface RawInternalWarningRow {
	warningData: string | WeatherWarningType[];
	expiresAt: Date | string;
}

export class WeatherRepository extends BaseRepository<WeatherCache> {
	async getCache(lat: number, lon: number) {
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

		const rawResults = (await this.execute(query)) as unknown as RawInternalWeatherRow[];

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
		this.persist(weatherCache);

		await this.nativeDelete({
			updatedAt: {$lte: new Date(Date.now() - 1000 * 60 * 60 * 3)},
		});
	}

	async getWarnings(lat: number, lon: number): Promise<WeatherWarningType[]> {
		const query = `
      SELECT warning_data as "warningData", expires_at as "expiresAt"
      FROM (
             SELECT warning_data, expires_at, updated_at,
                    (6371000 * acos( cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lon) - radians(${lon})) + sin(radians(${lat})) * sin(radians(lat)) )) AS distance_meters
             FROM weather_warning_cache
             WHERE expires_at > NOW() AND updated_at >= NOW() - INTERVAL '15 minutes'
           ) AS spatial_search
      WHERE distance_meters <= 2000
      ORDER BY distance_meters ASC
        LIMIT 1
    `;

		const rawResults = (await this.execute(query)) as unknown as RawInternalWarningRow[];

		const cachedRecord = rawResults.at(0);
		if (cachedRecord) {
			const parsed = typeof cachedRecord.warningData === 'string' ? JSON.parse(cachedRecord.warningData) : cachedRecord.warningData;
			const warnings = Array.isArray(parsed) ? parsed : [];
			return warnings.filter((w: WeatherWarningType) => !w.expires || new Date(w.expires).getTime() > Date.now());
		}

		const apiUrl = `https://api.weatherapi.com/v1/alerts.json?key=${config.WEATHER_API_KEY}&q=${encodeURIComponent(`${lat},${lon}`)}`;

		const apiResponse = await fetch(apiUrl);
		if (!apiResponse.ok) {
			throw new Error(`WeatherAPI alerts endpoint responded with status ${apiResponse.status}`);
		}

		const parsedJson = (await apiResponse.json()) as {
			alerts?: {
				alert?: Array<{
					headline?: string;
					msgtype?: string;
					msgType?: string;
					severity?: string;
					urgency?: string;
					areas?: string;
					category?: string;
					certainty?: string;
					event?: string;
					note?: string;
					effective?: string;
					expires?: string;
					desc?: string;
					instruction?: string;
				}>;
			};
		};

		const rawAlerts = Array.isArray(parsedJson.alerts?.alert) ? parsedJson.alerts.alert : [];
		const warnings: WeatherWarningType[] = rawAlerts.map(a => ({
			headline: String(a.headline || ''),
			msgtype: a.msgtype || a.msgType || undefined,
			severity: String(a.severity || ''),
			urgency: a.urgency || undefined,
			areas: a.areas || undefined,
			category: a.category || undefined,
			certainty: a.certainty || undefined,
			event: String(a.event || ''),
			note: a.note || undefined,
			effective: String(a.effective || ''),
			expires: String(a.expires || ''),
			desc: String(a.desc || ''),
			instruction: String(a.instruction || ''),
		}));

		const activeWarnings = warnings.filter(w => !w.expires || new Date(w.expires).getTime() > Date.now());

		let expiresAt = new Date(Date.now() + 15 * 60 * 1000);
		const futureExpiries = activeWarnings.map(w => (w.expires ? new Date(w.expires).getTime() : NaN)).filter(t => !isNaN(t) && t > Date.now());

		if (futureExpiries.length > 0) {
			const minExpiry = new Date(Math.min(...futureExpiries));
			if (minExpiry < expiresAt) {
				expiresAt = minExpiry;
			}
		}

		await this.createWarningsCache(lat, lon, activeWarnings, expiresAt);

		return activeWarnings;
	}

	async createWarningsCache(lat: number, lon: number, warnings: WeatherWarningType[], expiresAt: Date) {
		const warningCache = new WeatherWarningCache({
			lat,
			lon,
			warningData: warnings,
			expiresAt,
			updatedAt: new Date(),
		});
		this.persist(warningCache);

		await this.getEntityManager().nativeDelete(WeatherWarningCache, {
			$or: [{expiresAt: {$lte: new Date()}}, {updatedAt: {$lte: new Date(Date.now() - 1000 * 60 * 60 * 3)}}],
		});
	}
}
