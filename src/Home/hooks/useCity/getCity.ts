const BASE_URL = "https://api.openweathermap.org/geo/1.0";

export type GeocodeLocation = {
    name: string;
    local_names?: Record<string, string>;
    lat: number;
    lon: number;
    country: string;
    state?: string;
};

export async function getCity(
    lat: number,
    lon: number,
): Promise<GeocodeLocation[]> {
    const url = new URL(`${BASE_URL}/reverse`);

    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("limit", "1");
    url.searchParams.set(
        "appid",
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? "",
    );

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Geocoding fetch failed: ${res.status}`);
    }

    return res.json() as Promise<GeocodeLocation[]>;
}