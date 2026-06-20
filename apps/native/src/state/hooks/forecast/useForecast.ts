import { useAppSelector } from '~/state/storeHooks';

export function useForecast() {
  return useAppSelector((s) => s.forecast.data);
}
