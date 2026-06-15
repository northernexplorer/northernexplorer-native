import {config} from "~/config";

export type GeocodeLocation = {
    name: string;
    local_names?: Record<string, string>;
    lat: number;
    lon: number;
    country: string;
    state?: string;
};

export interface CityType {
    source: "database_cache" | "openweather_api";
    distance_offset?: string;
    cached_at?: string;
    data: GeocodeLocation[];
}

export async function getCity(
    lat: number,
    lon: number,
): Promise<GeocodeLocation[]> {
    const serverUrl = config.SERVER_URL;

    const url = new URL(`${serverUrl}/index.php`);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("type", "city");

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`City lookup fetch failed: ${res.status}`);
    }

    const json: CityType = await res.json();

    if (__DEV__) {
        console.log(`[City] Loaded via ${json.source}. ${json.distance_offset ?? ''}`);
    }

    return json.data;
}