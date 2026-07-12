import {useAppSelector} from '~/core/storeHooks';

export function useWeather() {
	return useAppSelector(s => s.weather.data);
}
