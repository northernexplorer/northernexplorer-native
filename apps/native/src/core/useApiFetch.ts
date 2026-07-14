import {useState, useEffect} from 'react';
import {ROUTES, GetParams, GetResponse, NonEmptyCategory} from '@northernexplorer/types';
import {apiClient} from '~/core/apiClient';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {useDispatch} from 'react-redux';
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

	const [, setTriggerError] = useState();

	useEffect(() => {
		if (!params) {
			setLoading(false);
			setData(null);
			return;
		}

		let isMounted = true;

		const fetchData = async () => {
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
				if (isMounted) {
					setData(result);
				}
			} catch (err) {
				if (isMounted) {
					const e = err instanceof Error ? err : new Error('Mutation failed');
					setError(e);
					alertStore.showAlert(e.message);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		fetchData();

		return () => {
			isMounted = false;
		};
	}, [category, controller, method, params ? JSON.stringify(params) : null, authentication?.accessToken]);

	return {data, loading, error};
}
