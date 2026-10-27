import {useEffect} from 'react';
import {useAppSelector, useAppDispatch} from '~/core/storeHooks';
import {setSubscription, setSubscriptionLoading, setSubscriptionError, clearSubscription} from '~/user/state/subscription/subscriptionSlice';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useApiFetch} from '~/core/useApiFetch';
import {useSyncToRedux} from '~/core/useSyncToRedux';

export function useSubscriptionBootstrap() {
	const authentication = useAuthentication();
	const dispatch = useAppDispatch();
	const {data, lastUpdated} = useAppSelector(s => s.subscription);

	const isLoggedIn = !!authentication?.username;

	useEffect(() => {
		if (!isLoggedIn && (data !== null || lastUpdated !== null)) {
			dispatch(clearSubscription());
		}
	}, [isLoggedIn, data, lastUpdated, dispatch]);

	const isStale = !lastUpdated || Date.now() - lastUpdated > 1000 * 60 * 15;
	const shouldFetch = isLoggedIn && (!data || isStale);

	const {data: fetchedData, loading, error} = useApiFetch('user', 'SubscriptionController', 'getPermissions', shouldFetch ? {} : null);

	useSyncToRedux(fetchedData, loading, error, {
		set: setSubscription,
		setLoading: setSubscriptionLoading,
		setError: setSubscriptionError,
	});
}
