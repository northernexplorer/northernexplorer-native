import {GetParams, GetResponse, NonEmptyCategory, ROUTES, UserAuthenticationType} from '@northernexplorer/types';
import {config} from '~/config';
import {authEvents} from '~/core/authEvents';

export async function apiClient<C extends NonEmptyCategory, K extends keyof ROUTES[C], M extends keyof ROUTES[C][K]>(
	category: C,
	controller: K,
	method: M,
	params: GetParams<C, K, M>,
	fetchMethod: 'GET' | 'POST',
	accessToken?: string,
	refreshToken?: string,
	onTokenRefresh?: (data: UserAuthenticationType) => void,
): Promise<GetResponse<C, K, M>> {
	const url = new URL(`${config.SERVER_URL}/api/${String(controller)}/${String(method)}`);

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
		options.cache = 'no-store';
		options.body = JSON.stringify(params);
	} else if (params && typeof params === 'object') {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				url.searchParams.set(key, String(value));
			}
		});
	}

	let res = await fetch(url.toString(), options);

	if (res.status === 401 && refreshToken && onTokenRefresh) {
		try {
			const refreshUrl = new URL(`${config.SERVER_URL}/api/UserController/refresh`);

			const refreshRes = await fetch(refreshUrl.toString(), {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({refreshToken}),
			});

			if (refreshRes.ok) {
				const tokenData = (await refreshRes.json()) as ROUTES['user']['UserController']['refresh']['response'];

				onTokenRefresh(tokenData);
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${tokenData.accessToken}`,
				};

				res = await fetch(url.toString(), options);
			} else {
				authEvents.emit('FORCE_LOGOUT');
			}
		} catch {
			authEvents.emit('FORCE_LOGOUT');
		}
	} else if (res.status === 401) {
		authEvents.emit('FORCE_LOGOUT');
	}

	if (!res.ok) {
		let serverMessage = '';
		try {
			const errorData = await res.json();
			serverMessage = errorData?.error;
		} catch {
			serverMessage = `HTTP Error ${res.status}`;
		}

		throw new Error(serverMessage || `API fetch failed [${String(method)}]: ${res.status}`);
	}
	return res.json() as Promise<GetResponse<C, K, M>>;
}
