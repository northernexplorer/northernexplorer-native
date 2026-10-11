import {useAppSelector} from '~/core/storeHooks';
import {setWeather, setWeatherWarnings, setWeatherLoading, setWeatherError} from '~/environment/state/weather/weatherSlice';
import {useApiFetch} from '~/core/useApiFetch';
import {useSyncToRedux} from '~/core/useSyncToRedux';

export function useWeatherBootstrap() {
	const coords = useAppSelector(s => s.location.data);
	const {data, lastUpdated, warningsLastUpdated} = useAppSelector(s => s.weather);

	const isStale = !lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 30;
	const shouldFetch = !!coords && (!data || isStale);

	const {
		data: fetchedData,
		loading,
		error,
	} = useApiFetch('environment', 'WeatherController', 'getData', shouldFetch ? {lat: coords!.lat, lon: coords!.lon} : null);

	useSyncToRedux(fetchedData, loading, error, {
		set: setWeather,
		setLoading: setWeatherLoading,
		setError: setWeatherError,
	});

	const isWarningsStale = !warningsLastUpdated || Date.now() - warningsLastUpdated > 1000 * 60 * 15;
	const shouldFetchWarnings = !!coords && (!warningsLastUpdated || isWarningsStale);

	const {
		data: fetchedWarnings,
		loading: warningsLoading,
		error: warningsError,
	} = useApiFetch('environment', 'WeatherController', 'getWarnings', shouldFetchWarnings ? {lat: coords!.lat, lon: coords!.lon} : null);

	useSyncToRedux(fetchedWarnings, warningsLoading, warningsError, {
		set: setWeatherWarnings,
	});
}
