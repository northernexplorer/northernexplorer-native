import {useState} from 'react';
import {ROUTES, GetParams, NonEmptyCategory} from '@northernexplorer/types';
import {useDispatch} from 'react-redux';
import {apiClient} from '~/core/apiClient';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {alertStore} from '~/core/alertStore';
import {useIsOffline} from '~/core/ConnectivityProvider';

export function useApiMutation<C extends NonEmptyCategory, K extends keyof ROUTES[C], M extends keyof ROUTES[C][K]>(
	category: C,
	controller: K,
	method: M,
) {
	const {isOffline} = useIsOffline();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const dispatch = useDispatch();
	const authentication = useAuthentication();

	const mutate = async (params: GetParams<C, K, M>) => {
		if (isOffline) {
			return;
		}
		setLoading(true);
		setError(null);
		try {
			return await apiClient(
				category,
				controller,
				method,
				params,
				'POST',
				authentication?.accessToken,
				authentication?.refreshToken,
				response => {
					if (authentication) {
						dispatch(setAuthentication(response));
					}
				},
			);
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
	};

	return {mutate, loading, error};
}
