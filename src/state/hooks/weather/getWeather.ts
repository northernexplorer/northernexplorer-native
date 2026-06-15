import {config} from "~/config";

export type WeatherType = {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        tz_id: string;
        localtime_epoch: number;
        localtime: string;
    };
    current: {
        last_updated_epoch: number;
        last_updated: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        gust_mph: number;
        gust_kph: number;
    };
};

interface PHPWeatherResponse {
    source: "database_cache" | "weatherapi_data";
    distance_offset?: string;
    cached_at?: string;
    data: WeatherType;
}

export async function getWeather(
    lat: number,
    lon: number,
): Promise<WeatherType> {
    const serverUrl = config.SERVER_URL;

    const url = new URL(`${serverUrl}/index.php`);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("type", "weather");

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Weather fetch failed: ${res.status}`);
    }

    const json: PHPWeatherResponse = await res.json();

    if (__DEV__) {
        console.log(`[Weather] Loaded via ${json.source}. ${json.distance_offset ?? ''}`);
    }

    return json.data;
}