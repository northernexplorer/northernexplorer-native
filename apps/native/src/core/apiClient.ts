import { GetParams, GetResponse, NonEmptyCategory, ROUTES } from '@northernexplorer/types';
import { config } from '~/config';
import { ApiMethod } from '~/core/useApiFetch';

export async function apiClient<
    C extends NonEmptyCategory,
    K extends keyof ROUTES[C],
    M extends keyof ROUTES[C][K],
>(
    category: C,
    controller: K,
    method: M,
    params: GetParams<C, K, M>,
    fetchMethod: 'GET' | 'POST',
    accessToken?: string,
): Promise<GetResponse<C, K, M>> {
    const route = ROUTES[category][controller][method] as unknown as ApiMethod;
    const endpoint = route.endpoint;
    const url = new URL(`${config.SERVER_URL}/api/${endpoint}`);
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const options: RequestInit = {
        method: fetchMethod,
        headers,
    };

    if (fetchMethod === 'POST') {
        options.body = JSON.stringify(params);
    } else if (params && typeof params === 'object') {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, String(value));
            }
        });
    }

    const res = await fetch(url.toString(), options);
    if (!res.ok) {
        throw new Error(`API fetch failed [${String(method)}]: ${res.status}`);
    }
    return res.json() as Promise<GetResponse<C, K, M>>;
}
