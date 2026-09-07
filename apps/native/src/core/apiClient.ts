import {GetParams, GetResponse, NonEmptyCategory, ROUTES, UserAuthenticationType} from '@northernexplorer/types';
import {config} from '~/config';
import {authEvents} from '~/core/authEvents';
import {store} from '~/core/store';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';

let refreshPromise: Promise<UserAuthenticationType | null> | null = null;

function refreshTokens(refreshToken: string): Promise<UserAuthenticationType | null> {
	if (!refreshPromise) {
		refreshPromise = (async () => {
			try {
				const refreshUrl = new URL(`${config.SERVER_URL}/api/UserController/refresh`);
				const refreshRes = await fetch(refreshUrl.toString(), {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({refreshToken}),
				});

				if (refreshRes.ok) {
					const data = (await refreshRes.json()) as UserAuthenticationType;
					store.dispatch(setAuthentication(data));
					return data;
				}

				// If refresh endpoint returns non-200 (e.g. 400/401/403 expired refresh token)
				store.dispatch(setAuthentication(null));
				return null;
			} catch {
				return null;
			} finally {
				refreshPromise = null;
			}
		})();
	}
	return refreshPromise;
}

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

	const currentAuth = store.getState().authentication.data;
	const tokenToUse = accessToken || currentAuth?.accessToken;
	const refreshTokenToUse = currentAuth?.refreshToken || refreshToken;

	const headers: Record<string, string> = {'Content-Type': 'application/json'};
	if (tokenToUse) {
		headers['Authorization'] = `Bearer ${tokenToUse}`;
	}

	const options: RequestInit = {method: fetchMethod, headers};

	if (fetchMethod === 'POST') {
		options.cache = 'no-store';
		options.body = JSON.stringify(params ?? {});
	} else if (params && typeof params === 'object') {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				if (Array.isArray(value)) {
					value.filter(v => v !== undefined && v !== null).forEach(v => url.searchParams.append(`${key}[]`, String(v)));
				} else {
					url.searchParams.set(key, String(value));
				}
			}
		});
	}

	let res = await fetch(url.toString(), options);

	// Consolidated 401 handling
	if (res.status === 401) {
		const latestAuth = store.getState().authentication.data;
		const activeRefreshToken = latestAuth?.refreshToken || refreshTokenToUse;
		let tokenData: UserAuthenticationType | null = null;

		// Check if a concurrent request already refreshed the access token
		if (latestAuth?.accessToken && latestAuth.accessToken !== tokenToUse) {
			tokenData = latestAuth;
		} else if (activeRefreshToken) {
			tokenData = await refreshTokens(activeRefreshToken);
		}

		if (tokenData) {
			onTokenRefresh?.(tokenData);

			// Retry request with fresh access token
			const retryHeaders = {...headers, Authorization: `Bearer ${tokenData.accessToken}`};
			res = await fetch(url.toString(), {...options, headers: retryHeaders});
		} else {
			authEvents.emit('FORCE_LOGOUT');
		}
	}

	if (!res.ok) {
		let serverMessage = '';
		try {
			const errorData = await res.json();
			serverMessage = typeof errorData?.error === 'string' ? errorData.error : JSON.stringify(errorData?.error || '');
		} catch {
			serverMessage = `HTTP Error ${res.status}`;
		}
		throw new Error(serverMessage || `API fetch failed [${String(method)}]: ${res.status}`);
	}

	return res.json() as Promise<GetResponse<C, K, M>>;
}
