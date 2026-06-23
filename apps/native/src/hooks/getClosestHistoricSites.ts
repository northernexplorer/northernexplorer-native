import { config } from '~/config';
import {
  ClosestHistoricSiteResponse,
  EndpointType,
  HistoricSiteType,
} from '@northernexplorer/types';

export async function getHistoricSites(lat: number, lon: number): Promise<HistoricSiteType[]> {
  const serverUrl = config.SERVER_URL;

  const url = new URL(`${serverUrl}/api/${EndpointType.HistoricSites}`);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Historic sites lookup fetch failed: ${res.status}`);
  }

  const json: ClosestHistoricSiteResponse = await res.json();

  // Return the full array of nearby sites directly
  return json.sites || [];
}
