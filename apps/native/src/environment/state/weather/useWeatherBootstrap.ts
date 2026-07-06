import { useAppSelector } from '~/core/storeHooks';
import {
    setWeather,
    setWeatherLoading,
    setWeatherError,
} from '~/environment/state/weather/weatherSlice';
import { useApiClient } from '~/core/useApiClient';
import { useSyncToRedux } from '~/core/useSyncToRedux';

export function useWeatherBootstrap() {
    const coords = useAppSelector((s) => s.location.data);
    const { data, lastUpdated } = useAppSelector((s) => s.weather);

    const isStale = !lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 30;
    const shouldFetch = !!coords && (!data || isStale);

    const {
        data: fetchedData,
        loading,
        error,
    } = useApiClient(
        'environment',
        'WeatherController',
        'getWeatherData',
        shouldFetch ? { lat: coords!.lat, lon: coords!.lon } : null,
    );

    useSyncToRedux(fetchedData, loading, error, {
        set: setWeather,
        setLoading: setWeatherLoading,
        setError: setWeatherError,
    });
}
