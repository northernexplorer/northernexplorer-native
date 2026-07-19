import {useState, useCallback} from 'react';
import {ROUTES, GetParams, GetResponse, NonEmptyCategory} from '@northernexplorer/types';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from 'expo-router';
import {apiClient} from '~/core/apiClient';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {alertStore} from '~/core/alertStore';

export function useApiFetch<C extends NonEmptyCategory, K extends keyof ROUTES[C], M extends keyof ROUTES[C][K]>(
	category: C,
	controller: K,
	method: M,
	params: GetParams<C, K, M> | null,
) {
	const [data, setData] = useState<GetResponse<C, K, M> | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const dispatch = useDispatch();
	const authentication = useAuthentication();

	const fetchData = useCallback(async () => {
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
			const e = err instanceof Error ? err : new Error('Mutation failed');
			setError(e);

			const isNetworkError =
				e instanceof TypeError &&
				(e.message.toLowerCase().includes('failed to fetch') ||
					e.message.toLowerCase().includes('network request failed') || // React Native
					e.message.toLowerCase().includes('networkerror') || // Firefox
					e.message.toLowerCase().includes('load failed')); // Safari

			if (!isNetworkError) {
				const alertType = e.message.includes('session has expired') ? 'warning' : 'error';
				alertStore.showAlert(e.message, alertType);
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
