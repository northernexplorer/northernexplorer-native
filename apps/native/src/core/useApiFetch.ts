import {useState, useCallback} from 'react';
import {ROUTES, GetParams, GetResponse, NonEmptyCategory} from '@northernexplorer/types';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from 'expo-router';
import {apiClient} from '~/core/apiClient';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {alertStore} from '~/core/alertStore';
import {useIsOffline} from '~/core/ConnectivityProvider';

export function useApiFetch<C extends NonEmptyCategory, K extends keyof ROUTES[C], M extends keyof ROUTES[C][K]>(
	category: C,
	controller: K,
	method: M,
	params: GetParams<C, K, M> | null,
) {
	const {isOffline} = useIsOffline();
	const [data, setData] = useState<GetResponse<C, K, M> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const dispatch = useDispatch();
	const authentication = useAuthentication();

	const fetchData = useCallback(async () => {
		if (isOffline) {
			setLoading(false);
			setData(null);
			return;
		}
		if (!params) {
			setLoading(false);
			setData(null);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await apiClient(
				category,
				controller,
				method,
				params,
				'GET',
				authentication?.accessToken,
				authentication?.refreshToken,
				response => {
					if (authentication) {
						dispatch(setAuthentication(response));
					}
				},
			);
			setData(result);
		} catch (err) {
			const e = err instanceof Error ? err : new Error(typeof err === 'string' ? err : 'Network request failed');
			setError(e);

			const msg = e.message.toLowerCase();

			const isNetworkError =
				msg.includes('failed to fetch') ||
				msg.includes('network request failed') || // React Native default
				msg.includes('fetch failed') || // Android native fetch failure
				msg.includes('connectexception') || // Java socket error
				msg.includes('failed to connect') || // "failed to connect to /..."
				msg.includes('connection refused') || // Socket refusal
				msg.includes('networkerror') || // Firefox / general
				msg.includes('load failed'); // Safari

			if (!isNetworkError) {
				const alertType = e.message.includes('Session Expired') ? 'warning' : 'error';
				alertStore.showAlert({message: e.message, type: alertType});
			} else {
				// Cache layer quietly serve stale/cached data
				console.log(`Silencing alert for network failure on ${String(method)}. Relying on cache.`);
			}
		} finally {
			setLoading(false);
		}
	}, [category, controller, method, params ? JSON.stringify(params) : null, authentication?.accessToken]);
	useFocusEffect(
		useCallback(() => {
			fetchData();
		}, [fetchData]),
	);

	return {data, loading, error, refetch: fetchData};
}
