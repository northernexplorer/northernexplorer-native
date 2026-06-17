import { config } from "~/config";

export interface FieldNoteType {
    title: string;
    body: string;
}

export async function getFieldNote(
    lat: number,
    lon: number,
): Promise<FieldNoteType> {
    const serverUrl = config.SERVER_URL;

    const url = new URL(`${serverUrl.replace(/\/$/, "")}/index.php`);

    url.searchParams.set("type", "fieldNote");
    url.searchParams.set("lat", lat.toString());
    url.searchParams.set("lon", lon.toString());

    const res = await fetch(url.toString());

    if (!res.ok) {
        throw new Error(`Field note request failed: ${res.status}`);
    }

    return res.json();
}