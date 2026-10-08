import {useAppSelector} from '~/core/storeHooks';

export function useWeatherWarnings() {
	return useAppSelector(s => s.weather.warnings);
}
