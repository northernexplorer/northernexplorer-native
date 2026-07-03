import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/state/storeHooks';
import { setCity, setCityLoading, setCityError } from '~/state/slices/citySlice';
import { apiClient } from '~/hooks/apiClient';

export function useCityBootstrap() {
  const dispatch = useAppDispatch();
  const coords = useAppSelector((s) => s.location.data);

  useEffect(() => {
    if (!coords) return;

    let cancelled = false;

    const { lat, lon } = coords;

    async function run() {
      try {
        dispatch(setCityLoading(true));

        const location = await apiClient('location', 'CityController', 'getCityData', {
          lat,
          lon,
        });

        if (cancelled) return;

        dispatch(setCity(location));
      } catch {
        if (!cancelled) {
          dispatch(setCityError('Failed to resolve city'));
        }
      } finally {
        if (!cancelled) {
          dispatch(setCityLoading(false));
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [coords, dispatch]);
}
