import {WeatherWarningType} from '@northernexplorer/types';
import {useAppSelector} from '~/core/storeHooks';

export function useWeatherWarnings(): WeatherWarningType[] {
	return useAppSelector(s => s.weather.warnings ?? []);
}
