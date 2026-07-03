import { useAppSelector } from '~/state/storeHooks';
import { setLunar, setLunarLoading, setLunarError } from '~/state/slices/lunar/lunarSlice';
import { useSyncToRedux } from '~/state/slices/useSyncToRedux';
import { useApiClient } from '~/hooks/useApiClient';

export function useLunarBootstrap() {
  const { data, lastUpdated } = useAppSelector((s) => s.lunar);

  const isStale = !lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 60 * 6;
  const shouldFetch = !data || isStale;

  const {
    data: fetchedData,
    loading,
    error,
  } = useApiClient('environment', 'LunarController', 'getLunarData', shouldFetch ? {} : null);

  useSyncToRedux(fetchedData, loading, error, {
    set: setLunar,
    setLoading: setLunarLoading,
    setError: setLunarError,
  });
}
