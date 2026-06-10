const BASE_URL = "https://api.openweathermap.org/data/2.5";

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

export async function getWeather(
    lat: number,
    lon: number,
): Promise<WeatherType> {
    const url = new URL(`${BASE_URL}/weather`);

    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set(
        "appid",
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? "",
    );
    url.searchParams.set("units", "metric");

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Weather fetch failed: ${res.status}`);
    }

    return res.json();
}