const BASE_URL = "https://api.openweathermap.org/data/2.5";

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
    pop: number; // probability of precipitation (0-1)
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

export async function getForecast(
    lat: number,
    lon: number,
): Promise<ForecastType> {
    const url = new URL(`${BASE_URL}/forecast`);

    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set(
        "appid",
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? "",
    );
    url.searchParams.set("units", "metric");

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Forecast fetch failed: ${res.status}`);
    }

    return res.json() as Promise<ForecastType>;
}