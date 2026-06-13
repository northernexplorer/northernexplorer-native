import {config} from "~/config";

export type WeatherType = {
    coord: {
        lon: number;
        lat: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level?: number;
        grnd_level?: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    rain?: {
        "1h"?: number;
        "3h"?: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
};

interface PHPWeatherResponse {
    source: "database_cache" | "openweather_api";
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