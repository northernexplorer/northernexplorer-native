import { config } from '~/config';
import { EndpointType, ForecastResponse, ForecastType } from '@northernexplorer/types';

export async function getForecast(lat: number, lon: number): Promise<ForecastType> {
  const serverUrl = config.SERVER_URL;

  const url = new URL(`${serverUrl}/api/${EndpointType.Forecast}`);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Forecast fetch failed: ${res.status}`);
  }

  const json: ForecastResponse = await res.json();

  return json.data;
}
