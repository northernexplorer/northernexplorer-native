import { useAppSelector } from '~/state/storeHooks';
import { useApiClient } from '~/hooks/useApiClient';
import { setForecast, setForecastError, setForecastLoading } from '~/state/slices/forecast/forecastSlice';
import { useSyncToRedux } from '~/state/slices/useSyncToRedux';

export function useForecastBootstrap() {
  const coords = useAppSelector((s) => s.location.data);
  const { data, lastUpdated } = useAppSelector((s) => s.forecast);

  const isStale = !lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 30;
  const shouldFetch = !!coords && (!data || isStale);

  const {
    data: fetchedData,
    loading,
    error,
  } = useApiClient(
    'environment',
    'ForecastController',
    'getForecastData',
    shouldFetch ? { lat: coords!.lat, lon: coords!.lon } : null,
  );

  useSyncToRedux(fetchedData, loading, error, {
    set: setForecast,
    setLoading: setForecastLoading,
    setError: setForecastError,
  });
}
