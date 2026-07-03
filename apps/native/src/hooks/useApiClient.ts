import { useState, useEffect } from 'react';
import { ROUTES, GetParams, GetResponse, NonEmptyCategory } from '@northernexplorer/types';
import { apiClient } from '~/hooks/apiClient';

export function useApiClient<
  C extends NonEmptyCategory,
  K extends keyof ROUTES[C],
  M extends keyof ROUTES[C][K],
>(category: C, controller: K, method: M, params: GetParams<C, K, M> | null) {
  const [data, setData] = useState<GetResponse<C, K, M> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
        const result = await apiClient(category, controller, method, params);
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
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
    // 3. Stringify handles nulls gracefully in the dependency array
  }, [category, controller, method, params ? JSON.stringify(params) : null]);

  return { data, loading, error };
}
