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
    country: string;
    region: string;
};

export async function getHistoricSiteDetails(id: string | number): Promise<HistoricSiteType> {
    const serverUrl = config.SERVER_URL;

    const url = new URL(`${serverUrl}/index.php`);
    url.searchParams.set("id", String(id));
    url.searchParams.set("type", "historicSiteDetails");

    const res = await fetch(url.toString());

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error(`Historic site profile with ID ${id} could not be found.`);
        }
        throw new Error(`Historic site detail lookup failed with status: ${res.status}`);
    }

    const json: HistoricSiteType = await res.json();
    return json;
}