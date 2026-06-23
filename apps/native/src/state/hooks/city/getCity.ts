import { config } from '~/config';
import { CityResponse, CityType, EndpointType } from '@northernexplorer/types';

export async function getCity(lat: number, lon: number): Promise<CityType> {
  const serverUrl = config.SERVER_URL;

  const url = new URL(`${serverUrl}/api/${EndpointType.City}`);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`City lookup fetch failed: ${res.status}`);
  }

  const json: CityResponse = await res.json();

  const cityDetails = json.data.at(0);
  if (!cityDetails) throw new Error('No city found');

  return cityDetails;
}
