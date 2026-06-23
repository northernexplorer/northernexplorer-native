import { config } from '~/config';
import { EndpointType, LunarCycleType } from '@northernexplorer/types';

export async function getLunarCycle(): Promise<LunarCycleType> {
  const serverUrl = config.SERVER_URL;

  const url = new URL(`${serverUrl}/api/${EndpointType.Lunar}`);

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Lunar fetch failed: ${res.status}`);
  }

  return res.json() as Promise<LunarCycleType>;
}
