import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/state/storeHooks';
import { getForecast } from './getForecast';
import { setForecast, setForecastError, setForecastLoading } from '~/state/slices/forecastSlice';

const STALE_TIME = 1000 * 60 * 30;

export function useForecastBootstrap() {
  const dispatch = useAppDispatch();

  const coords = useAppSelector((s) => s.location.data);
  const { data, lastUpdated } = useAppSelector((s) => s.forecast);

  useEffect(() => {
    if (!coords) return;

    const isStale = !lastUpdated || Date.now() - lastUpdated > STALE_TIME;

    if (data && !isStale) return;

    let cancelled = false;

    const { lat, lon } = coords;

    async function run() {
      try {
        dispatch(setForecastLoading(true));

        const result = await getForecast(lat, lon);

        if (cancelled) return;

        dispatch(setForecast(result));
      } catch {
        if (!cancelled) {
          dispatch(setForecastError('Failed to fetch forecast'));
        }
      } finally {
        if (!cancelled) {
          dispatch(setForecastLoading(false));
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [coords, lastUpdated, dispatch]);
}
