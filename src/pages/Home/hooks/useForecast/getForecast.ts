import {config} from "~/config";

export type ForecastType = {
    cod: string;
    message: number;
    cnt: number;
    list: ForecastEntry[];
    city: ForecastCity;
};

export type ForecastEntry = {
    dt: number;
    dt_txt: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level?: number;
        grnd_level?: number;
        humidity: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: {
        "3h"?: number;
    };
    snow?: {
        "3h"?: number;
    };
};

export type ForecastCity = {
    id: number;
    name: string;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
    coord: {
        lat: number;
        lon: number;
    };
};

interface PHPForecastResponse {
    source: "database_cache" | "openweather_api";
    distance_offset?: string;
    cached_at?: string;
    data: ForecastType;
}

export async function getForecast(
    lat: number,
    lon: number,
): Promise<ForecastType> {
    const serverUrl = config.SERVER_URL;

    const url = new URL(`${serverUrl}/index.php`);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("type", "forecast");

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Forecast fetch failed: ${res.status}`);
    }

    const json: PHPForecastResponse = await res.json();

    return json.data;
}