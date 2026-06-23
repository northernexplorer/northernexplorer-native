import { config } from '~/config';
import { EndpointType, WeatherResponse, WeatherType } from '@northernexplorer/types';

export async function getWeather(lat: number, lon: number): Promise<WeatherType> {
  const serverUrl = config.SERVER_URL;

  const url = new URL(`${serverUrl}/api/${EndpointType.Weather}`);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.status}`);
  }

  const json: WeatherResponse = await res.json();

  return json.data;
}
