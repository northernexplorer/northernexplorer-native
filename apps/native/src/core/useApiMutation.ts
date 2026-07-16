import {useState} from 'react';
import {ROUTES, GetParams, NonEmptyCategory} from '@northernexplorer/types';
import {apiClient} from '~/core/apiClient';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {useDispatch} from 'react-redux';
import {alertStore} from '~/core/alertStore';

export function useApiMutation<C extends NonEmptyCategory, K extends keyof ROUTES[C], M extends keyof ROUTES[C][K]>(
	category: C,
	controller: K,
	method: M,
) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const dispatch = useDispatch();
	const authentication = useAuthentication();

	const mutate = async (params: GetParams<C, K, M>) => {
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
			const e = err instanceof Error ? err : new Error('Mutation failed');
			setError(e);

			const isNetworkError =
				e instanceof TypeError &&
				(e.message.toLowerCase().includes('failed to fetch') ||
					e.message.toLowerCase().includes('network request failed') || // React Native
					e.message.toLowerCase().includes('networkerror') || // Firefox
					e.message.toLowerCase().includes('load failed')); // Safari

			// Only fire the global alert if it's NOT a network failure
			if (!isNetworkError) {
				alertStore.showAlert(e.message);
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
