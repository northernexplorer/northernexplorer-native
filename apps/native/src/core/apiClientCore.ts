import type {GetParams, GetResponse, NonEmptyCategory, ROUTES, UserAuthenticationType} from '@northernexplorer/types';

export type ApiClientOptions = {
	anonymous?: boolean;
};

type RefreshResult =
	{status: 'refreshed'; authentication: UserAuthenticationType} | {status: 'expired'} | {status: 'stale'} | {status: 'failed'; error: Error};

type ApiClientDependencies = {
	baseUrl: string;
	fetch: typeof fetch;
	getAuthentication: () => UserAuthenticationType | null;
	setAuthentication: (authentication: UserAuthenticationType) => void;
	onForceLogout: () => void;
};

function toError(error: unknown): Error {
	return error instanceof Error ? error : new Error(String(error));
}

export function createApiClient(dependencies: ApiClientDependencies) {
	const fetch = dependencies.fetch.bind(globalThis);
	const refreshPromises = new Map<string, Promise<RefreshResult>>();
	const logoutRequestedFor = new WeakSet<UserAuthenticationType>();

	const refreshTokens = (refreshToken: string, expectedAuthentication: UserAuthenticationType): Promise<RefreshResult> => {
		const existingPromise = refreshPromises.get(refreshToken);
		if (existingPromise) return existingPromise;

		const refreshPromise = (async (): Promise<RefreshResult> => {
			try {
				const refreshUrl = new URL(`${dependencies.baseUrl}/api/UserController/refresh`);
				const refreshResponse = await fetch(refreshUrl.toString(), {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({refreshToken}),
				});

				if (refreshResponse.status === 401) return {status: 'expired'};
				if (!refreshResponse.ok) {
					let message = '';
					try {
						const errorData = await refreshResponse.json();
						message = typeof errorData?.error === 'string' ? errorData.error : '';
					} catch {
						// Use the status code when the server does not return a readable error response.
					}
					return {status: 'failed', error: new Error(message || `Token refresh failed [${refreshResponse.status}]`)};
				}

				const authentication = (await refreshResponse.json()) as UserAuthenticationType;
				if (!authentication.accessToken || !authentication.refreshToken) {
					return {status: 'failed', error: new Error('Token refresh returned an invalid response.')};
				}
				if (dependencies.getAuthentication() !== expectedAuthentication) return {status: 'stale'};

				dependencies.setAuthentication(authentication);
				return {status: 'refreshed', authentication};
			} catch (error: unknown) {
				return {status: 'failed', error: toError(error)};
			} finally {
				refreshPromises.delete(refreshToken);
			}
		})();

		refreshPromises.set(refreshToken, refreshPromise);
		return refreshPromise;
	};

	const request = async <C extends NonEmptyCategory, K extends keyof ROUTES[C], M extends keyof ROUTES[C][K]>(
		category: C,
		controller: K,
		method: M,
		params: GetParams<C, K, M>,
		fetchMethod: 'GET' | 'POST',
		options?: ApiClientOptions,
	): Promise<GetResponse<C, K, M>> => {
		const url = new URL(`${dependencies.baseUrl}/api/${String(controller)}/${String(method)}`);
		const authenticationAtRequest = options?.anonymous ? null : dependencies.getAuthentication();
		const tokenToUse = authenticationAtRequest?.accessToken;

		const headers: Record<string, string> = {'Content-Type': 'application/json'};
		if (tokenToUse) headers.Authorization = `Bearer ${tokenToUse}`;

		const requestOptions: RequestInit = {method: fetchMethod, headers};
		if (fetchMethod === 'POST') {
			requestOptions.cache = 'no-store';
			requestOptions.body = JSON.stringify(params ?? {});
		} else if (params && typeof params === 'object') {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					if (Array.isArray(value)) {
						value.filter(item => item !== undefined && item !== null).forEach(item => url.searchParams.append(`${key}[]`, String(item)));
					} else {
						url.searchParams.set(key, String(value));
					}
				}
			});
		}

		let response = await fetch(url.toString(), requestOptions);

		if (response.status === 401 && authenticationAtRequest && tokenToUse) {
			const latestAuthentication = dependencies.getAuthentication();
			if (latestAuthentication?.userId === authenticationAtRequest.userId && latestAuthentication.accessToken !== tokenToUse) {
				response = await retryWithToken(fetch, url, requestOptions, headers, latestAuthentication.accessToken);
			} else if (latestAuthentication?.refreshToken === authenticationAtRequest.refreshToken) {
				const refreshResult = await refreshTokens(authenticationAtRequest.refreshToken, authenticationAtRequest);
				if (refreshResult.status === 'failed') throw refreshResult.error;
				if (refreshResult.status === 'stale') throw new Error('Authentication changed while the request was in progress.');
				if (refreshResult.status === 'expired') {
					if (dependencies.getAuthentication() === authenticationAtRequest && !logoutRequestedFor.has(authenticationAtRequest)) {
						logoutRequestedFor.add(authenticationAtRequest);
						dependencies.onForceLogout();
					}
				} else {
					const currentAuthentication = dependencies.getAuthentication();
					if (
						currentAuthentication?.userId !== authenticationAtRequest.userId ||
						currentAuthentication.refreshToken !== refreshResult.authentication.refreshToken
					) {
						throw new Error('Authentication changed while the request was in progress.');
					}
					response = await retryWithToken(fetch, url, requestOptions, headers, refreshResult.authentication.accessToken);
				}
			}
		}

		if (!response.ok) {
			let serverMessage = '';
			try {
				const errorData = await response.json();
				serverMessage = typeof errorData?.error === 'string' ? errorData.error : JSON.stringify(errorData?.error || '');
			} catch {
				serverMessage = `HTTP Error ${response.status}`;
			}
			throw new Error(serverMessage || `API fetch failed [${String(method)}]: ${response.status}`);
		}

		return response.json() as Promise<GetResponse<C, K, M>>;
	};

	return request;
}

async function retryWithToken(
	fetch: typeof globalThis.fetch,
	url: URL,
	options: RequestInit,
	headers: Record<string, string>,
	accessToken: string,
): Promise<Response> {
	return fetch(url.toString(), {...options, headers: {...headers, Authorization: `Bearer ${accessToken}`}});
}
