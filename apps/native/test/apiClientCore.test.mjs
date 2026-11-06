import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createApiClient} from '../src/core/apiClientCore.ts';

const baseAuthentication = (username = 'alice', accessToken = 'expired-access', refreshToken = 'refresh-alice') => ({
	userId: username,
	email: `${username}@example.com`,
	username,
	accessToken,
	refreshToken,
});

const jsonResponse = (status, body) => new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json'}});

const getStatus = (client, options) =>
	client('system', 'StatusController', 'getStatus', {tick: 1, iosVersion: '', androidVersion: ''}, 'GET', options);

function makeHarness(fetcher, initialAuthentication = baseAuthentication()) {
	let authentication = initialAuthentication;
	let forceLogoutCount = 0;
	const client = createApiClient({
		baseUrl: 'https://api.example.com',
		fetch: fetcher,
		getAuthentication: () => authentication,
		setAuthentication: newAuthentication => {
			authentication = newAuthentication;
		},
		onForceLogout: () => {
			forceLogoutCount += 1;
			authentication = null;
		},
	});

	return {
		client,
		getAuthentication: () => authentication,
		setAuthentication: newAuthentication => {
			authentication = newAuthentication;
		},
		get forceLogoutCount() {
			return forceLogoutCount;
		},
	};
}

test('anonymous status checks do not send credentials or refresh/logout a session', async () => {
	let authorization = 'not-checked';
	let refreshRequests = 0;
	let statusChecks = 0;
	const harness = makeHarness((input, init) => {
		if (String(input).endsWith('/refresh')) refreshRequests += 1;
		authorization = new Headers(init?.headers).get('Authorization');
		statusChecks += 1;
		return Promise.resolve(
			statusChecks === 1
				? jsonResponse(200, {online: true, upgradeRequired: false})
				: jsonResponse(401, {error: 'Unauthorized: Session Expired'}),
		);
	});

	await getStatus(harness.client, {anonymous: true});
	await assert.rejects(getStatus(harness.client, {anonymous: true}), /Unauthorized: Session Expired/);

	assert.equal(authorization, null);
	assert.equal(statusChecks, 2);
	assert.equal(refreshRequests, 0);
	assert.equal(harness.forceLogoutCount, 0);
	assert.ok(harness.getAuthentication());
});

test('concurrent unauthorized requests share one token refresh and retry with the refreshed token', async () => {
	let resolveRefresh;
	const refreshResponse = new Promise(resolve => {
		resolveRefresh = resolve;
	});
	let refreshRequests = 0;
	let retries = 0;
	const harness = makeHarness(async (input, init) => {
		if (String(input).endsWith('/refresh')) {
			refreshRequests += 1;
			return refreshResponse;
		}
		if (new Headers(init?.headers).get('Authorization') === 'Bearer expired-access') {
			return jsonResponse(401, {error: 'Unauthorized: Session Expired'});
		}
		retries += 1;
		return jsonResponse(200, {online: true, upgradeRequired: false});
	});

	const requests = [getStatus(harness.client), getStatus(harness.client)];
	await new Promise(resolve => setTimeout(resolve, 0));
	assert.equal(refreshRequests, 1);
	resolveRefresh(jsonResponse(200, baseAuthentication('alice', 'fresh-access', 'fresh-refresh')));
	await Promise.all(requests);

	assert.equal(refreshRequests, 1);
	assert.equal(retries, 2);
	assert.equal(harness.getAuthentication()?.accessToken, 'fresh-access');
	assert.equal(harness.forceLogoutCount, 0);
});

test('an invalid refresh token logs out once for concurrent unauthorized requests', async () => {
	let refreshRequests = 0;
	const harness = makeHarness(input => {
		if (String(input).endsWith('/refresh')) {
			refreshRequests += 1;
			return Promise.resolve(jsonResponse(401, {error: 'Unauthorized: Session Expired'}));
		}
		return Promise.resolve(jsonResponse(401, {error: 'Unauthorized: Session Expired'}));
	});

	const results = await Promise.allSettled([getStatus(harness.client), getStatus(harness.client)]);

	assert.equal(results.filter(result => result.status === 'rejected').length, 2);
	assert.equal(refreshRequests, 1);
	assert.equal(harness.forceLogoutCount, 1);
	assert.equal(harness.getAuthentication(), null);
});

test('temporary refresh network and server failures do not log out the user', async t => {
	for (const failure of ['network', 'server']) {
		await t.test(failure, async () => {
			const harness = makeHarness(input => {
				if (String(input).endsWith('/refresh')) {
					if (failure === 'network') return Promise.reject(new Error('Network request failed'));
					return Promise.resolve(jsonResponse(503, {error: 'Maintenance in progress'}));
				}
				return Promise.resolve(jsonResponse(401, {error: 'Unauthorized: Session Expired'}));
			});

			await assert.rejects(getStatus(harness.client), failure === 'network' ? /Network request failed/ : /Maintenance in progress/);
			assert.equal(harness.forceLogoutCount, 0);
			assert.equal(harness.getAuthentication()?.username, 'alice');
		});
	}
});

test('a refresh finishing after a different user signs in cannot overwrite or log out that user', async () => {
	let resolveRefresh;
	let resolveRefreshStarted;
	const refreshStarted = new Promise(resolve => {
		resolveRefreshStarted = resolve;
	});
	const refreshResponse = new Promise(resolve => {
		resolveRefresh = resolve;
	});
	let protectedRequests = 0;
	const harness = makeHarness(input => {
		if (String(input).endsWith('/refresh')) {
			resolveRefreshStarted();
			return refreshResponse;
		}
		protectedRequests += 1;
		return Promise.resolve(jsonResponse(401, {error: 'Unauthorized: Session Expired'}));
	});

	const pendingRequest = getStatus(harness.client);
	await refreshStarted;
	const bobAuthentication = baseAuthentication('bob', 'bob-access', 'bob-refresh');
	harness.setAuthentication(bobAuthentication);
	resolveRefresh(jsonResponse(200, baseAuthentication('alice', 'alice-fresh-access', 'alice-fresh-refresh')));

	await assert.rejects(pendingRequest, /Authentication changed while the request was in progress/);
	assert.equal(harness.getAuthentication()?.username, 'bob');
	assert.equal(protectedRequests, 1);
	assert.equal(harness.forceLogoutCount, 0);
});

test('an expired refresh for a replaced session with the same token cannot log out the new session', async () => {
	let resolveRefresh;
	let resolveRefreshStarted;
	const refreshStarted = new Promise(resolve => {
		resolveRefreshStarted = resolve;
	});
	const refreshResponse = new Promise(resolve => {
		resolveRefresh = resolve;
	});
	const harness = makeHarness(input => {
		if (String(input).endsWith('/refresh')) {
			resolveRefreshStarted();
			return refreshResponse;
		}
		return Promise.resolve(jsonResponse(401, {error: 'Unauthorized: Session Expired'}));
	});

	const pendingRequest = getStatus(harness.client);
	await refreshStarted;
	const replacementAuthentication = baseAuthentication('alice', 'replacement-access', 'refresh-alice');
	harness.setAuthentication(replacementAuthentication);
	resolveRefresh(jsonResponse(401, {error: 'Unauthorized: Session Expired'}));

	await assert.rejects(pendingRequest, /Unauthorized: Session Expired/);
	assert.equal(harness.getAuthentication(), replacementAuthentication);
	assert.equal(harness.forceLogoutCount, 0);
});
