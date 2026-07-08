import { useState } from 'react';
import { ROUTES, GetParams, NonEmptyCategory } from '@northernexplorer/types';
import { apiClient } from '~/core/apiClient';
import { useAuthentication } from '~/user/state/authentication/useAuthentication';
import { setAuthentication } from '~/user/state/authentication/authenticationSlice';
import { useDispatch } from 'react-redux';

export interface ApiMethod<P = unknown, R = unknown, E = string> {
    params: P;
    response: R;
    endpoint: E;
}

export function useApiMutation<
    C extends NonEmptyCategory,
    K extends keyof ROUTES[C],
    M extends keyof ROUTES[C][K],
>(category: C, controller: K, method: M) {
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
                (response) => {
                    if (authentication) {
                        dispatch(setAuthentication(response));
                    }
                },
            );
        } catch (err) {
            const e = err instanceof Error ? err : new Error('Mutation failed');
            setError(e);
            throw e; // Rethrow to handle in the component
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error };
}
