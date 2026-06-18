import { config } from "~/config";

export type HistoricSiteType = {
    id: number;
    name: string;
    description: string;
    image: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    distance_offset_meters: number;
    country: string;
    region: string;
};

export interface HistoricSiteResponse {
    source: "database_records";
    count: number;
    sites: HistoricSiteType[];
}

export async function getHistoricSites(
    lat: number,
    lon: number,
): Promise<HistoricSiteType[]> {
    const serverUrl = config.SERVER_URL;

    const url = new URL(`${serverUrl}/index.php`);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("type", "historicSites");

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Historic sites lookup fetch failed: ${res.status}`);
    }

    const json: HistoricSiteResponse = await res.json();

    // Return the full array of nearby sites directly
    return json.sites || [];
}