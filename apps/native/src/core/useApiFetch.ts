import {useState, useCallback} from 'react';
import {ROUTES, GetParams, GetResponse, NonEmptyCategory} from '@northernexplorer/types';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from 'expo-router';
import {apiClient} from '~/core/apiClient';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {alertStore} from '~/core/alertStore';
import {useIsOffline} from '~/core/ConnectivityProvider';

const apiCache = new Map<string, any>();

export function useApiFetch<C extends NonEmptyCategory, K extends keyof ROUTES[C], M extends keyof ROUTES[C][K]>(
	category: C,
	controller: K,
	method: M,
	params: GetParams<C, K, M> | null,
) {
	const {isOffline} = useIsOffline();
	const serializedParams = params ? JSON.stringify(params) : null;
	const cacheKey = serializedParams !== null ? `${category}:${String(controller)}:${String(method)}:${serializedParams}` : null;

	const [data, setData] = useState<GetResponse<C, K, M> | null>(() => {
		if (cacheKey && apiCache.has(cacheKey)) {
			return apiCache.get(cacheKey);
		}
		return null;
	});
	const [loading, setLoading] = useState<boolean>(() => {
		if (cacheKey && apiCache.has(cacheKey)) {
			return false;
		}
		return true;
	});
	const [error, setError] = useState<Error | null>(null);
	const dispatch = useDispatch();
	const authentication = useAuthentication();

	const fetchData = useCallback(async () => {
		if (isOffline) {
			setLoading(false);
			if (cacheKey && apiCache.has(cacheKey)) {
				setData(apiCache.get(cacheKey));
			}
			return;
		}
		if (!params) {
			setLoading(false);
			setData(null);
			return;
		}

		if (!cacheKey || !apiCache.has(cacheKey)) {
			setLoading(true);
		}
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
			if (cacheKey) {
				apiCache.set(cacheKey, result);
			}
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
	}, [category, controller, method, serializedParams, cacheKey, isOffline, authentication?.accessToken, authentication?.refreshToken, dispatch, authentication]);
	useFocusEffect(
		useCallback(() => {
			fetchData();
		}, [fetchData]),
	);

	return {data, loading, error, refetch: fetchData};
}
