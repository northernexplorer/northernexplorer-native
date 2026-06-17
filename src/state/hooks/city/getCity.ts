import {config} from "~/config";

export type CityType = {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    url: string;
};

interface CityResponse {
    source: "database_cache" | "weatherapi_data";
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

    const cityDetails = json.data.at(0);
    if (!cityDetails) throw new Error("No city found");

    return cityDetails;
}