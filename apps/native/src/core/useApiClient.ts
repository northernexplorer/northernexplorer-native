import { useState, useEffect } from 'react';
import { ROUTES, GetParams, GetResponse, NonEmptyCategory } from '@northernexplorer/types';
import { config } from '~/config';

export interface ApiMethod<P = unknown, R = unknown, E = string> {
  params: P;
  response: R;
  endpoint: E;
}

export async function apiClient<
  C extends NonEmptyCategory,
  K extends keyof ROUTES[C],
  M extends keyof ROUTES[C][K],
>(
  category: C,
  controller: K,
  method: M,
  params: GetParams<C, K, M>,
): Promise<GetResponse<C, K, M>> {
  const route = ROUTES[category][controller][method] as unknown as ApiMethod;
  const endpoint = route.endpoint;

  const url = new URL(`${config.SERVER_URL}/api/${endpoint}`);

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`API fetch failed [${String(method)}]: ${res.status}`);
  }
  return res.json() as Promise<GetResponse<C, K, M>>;
}

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
  }, [category, controller, method, params ? JSON.stringify(params) : null]);

  return { data, loading, error };
}
