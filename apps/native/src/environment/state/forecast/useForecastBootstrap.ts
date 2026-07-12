import {useAppSelector} from '~/core/storeHooks';
import {useApiFetch} from '~/core/useApiFetch';
import {setForecast, setForecastError, setForecastLoading} from '~/environment/state/forecast/forecastSlice';
import {useSyncToRedux} from '~/core/useSyncToRedux';

export function useForecastBootstrap() {
	const coords = useAppSelector(s => s.location.data);
	const {data, lastUpdated} = useAppSelector(s => s.forecast);

	const isStale = !lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 30;
	const shouldFetch = !!coords && (!data || isStale);

	const {
		data: fetchedData,
		loading,
		error,
	} = useApiFetch('environment', 'ForecastController', 'getForecastData', shouldFetch ? {lat: coords!.lat, lon: coords!.lon} : null);

	useSyncToRedux(fetchedData, loading, error, {
		set: setForecast,
		setLoading: setForecastLoading,
		setError: setForecastError,
	});
}
