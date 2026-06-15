import {config} from "~/config";

export type CityType = {
    name: string;
    local_names?: Record<string, string>;
    lat: number;
    lon: number;
    country: string;
    state?: string;
};

interface CityResponse {
    source: "database_cache" | "openweather_api";
    distance_offset?: string;
    cached_at?: string;
    data: CityType[];
}

export async function getCity(
    lat: number,
    lon: number,
): Promise<CityType> {
    const serverUrl = config.SERVER_URL;

    const url = new URL(`${serverUrl}/index.php`);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("type", "city");

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`City lookup fetch failed: ${res.status}`);
    }

    const json: CityResponse = await res.json();

    if (__DEV__) {
        console.log(`[City] Loaded via ${json.source}. ${json.distance_offset ?? ''}`);
    }

    const cityDetails = json.data.at(0);
    if(!cityDetails) throw new Error("No city found");

    return cityDetails;
}