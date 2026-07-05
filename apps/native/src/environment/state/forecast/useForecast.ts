import { useAppSelector } from '~/core/storeHooks';

export function useForecast() {
    return useAppSelector((s) => s.forecast.data);
}
