import {useState, useCallback, useEffect, useRef} from 'react';
import {ROUTES, GetParams, GetResponse, NonEmptyCategory} from '@northernexplorer/types';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from 'expo-router';
import {apiClient} from '~/core/apiClient';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {alertStore} from '~/core/alertStore';
import {useIsOffline} from '~/core/ConnectivityProvider';

const apiCache = new Map<string, unknown>();

export function useApiFetch<C extends NonEmptyCategory, K extends keyof ROUTES[C], M extends keyof ROUTES[C][K]>(
	category: C,
	controller: K,
	method: M,
	params: GetParams<C, K, M> | null,
) {
	const {isOffline} = useIsOffline();
	const serializedParams = params ? JSON.stringify(params) : null;
	const cacheKey = serializedParams !== null ? `${category}:${String(controller)}:${String(method)}:${serializedParams}` : null;

	const cacheKeyRef = useRef(cacheKey);
	cacheKeyRef.current = cacheKey;

	// Type-safe helper to retrieve cached data without returning 'unknown'
	const getCachedData = useCallback((key: string | null): GetResponse<C, K, M> | null => {
		if (key && apiCache.has(key)) {
			return apiCache.get(key) as GetResponse<C, K, M>;
		}
		return null;
	}, []);

	const [data, setData] = useState<GetResponse<C, K, M> | null>(() => getCachedData(cacheKey));
	const [loading, setLoading] = useState<boolean>(() => !getCachedData(cacheKey));
	const [error, setError] = useState<Error | null>(null);

	const dispatch = useDispatch();
	const authentication = useAuthentication();

	// Preserve stale cache immediately when parameters change
	useEffect(() => {
		const cached = getCachedData(cacheKey);
		if (cached !== null) {
			setData(cached);
			setLoading(false);
		} else if (!cacheKey) {
			setData(null);
			setLoading(false);
		}
	}, [cacheKey, getCachedData]);

	const fetchData = useCallback(async () => {
		const currentCacheKey = cacheKeyRef.current;

		if (isOffline) {
			setLoading(false);
			const cached = getCachedData(currentCacheKey);
			if (cached !== null) {
				setData(cached);
			}
			return;
		}

		if (!params) {
			setLoading(false);
			setData(null);
			return;
		}

		// Only show full loading state on initial load when cache is empty
		if (!currentCacheKey || !apiCache.has(currentCacheKey)) {
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

			if (currentCacheKey) {
				apiCache.set(currentCacheKey, result);
			}
			setData(result as GetResponse<C, K, M>);
		} catch (err) {
			const e = err instanceof Error ? err : new Error(typeof err === 'string' ? err : 'Network request failed');
			setError(e);

			const msg = e.message.toLowerCase();

			const isNetworkError =
				msg.includes('failed to fetch') ||
				msg.includes('network request failed') ||
				msg.includes('fetch failed') ||
				msg.includes('connectexception') ||
				msg.includes('failed to connect') ||
				msg.includes('connection refused') ||
				msg.includes('networkerror') ||
				msg.includes('load failed');

			if (!isNetworkError) {
				const alertType = e.message.includes('Session Expired') ? 'warning' : 'error';
				alertStore.showAlert({message: e.message, type: alertType});
			} else {
				console.log(`Silencing alert for network failure on ${String(method)}. Relying on cache.`);
			}
		} finally {
			setLoading(false);
		}
	}, [
		category,
		controller,
		method,
		serializedParams,
		isOffline,
		authentication?.accessToken,
		authentication?.refreshToken,
		dispatch,
		authentication,
		getCachedData,
	]);

	useFocusEffect(
		useCallback(() => {
			fetchData();
		}, [fetchData]),
	);

	return {data, loading, error, refetch: fetchData};
}
