import {useAppSelector} from '~/core/storeHooks';
import {setLunar, setLunarLoading, setLunarError} from '~/environment/state/lunar/lunarSlice';
import {useSyncToRedux} from '~/core/useSyncToRedux';
import {useApiFetch} from '~/core/useApiFetch';

export function useLunarBootstrap() {
	const {data, lastUpdated} = useAppSelector(s => s.lunar);

	const isStale = !lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 60 * 6;
	const shouldFetch = !data || isStale;

	const {data: fetchedData, loading, error} = useApiFetch('environment', 'LunarController', 'getLunarData', shouldFetch ? {} : null);

	useSyncToRedux(fetchedData, loading, error, {
		set: setLunar,
		setLoading: setLunarLoading,
		setError: setLunarError,
	});
}
