import {config} from '~/config';
import {authEvents} from '~/core/authEvents';
import {store} from '~/core/store';
import {setAuthentication} from '~/user/state/authentication/authenticationSlice';
import {createApiClient} from '~/core/apiClientCore';

export type {ApiClientOptions} from '~/core/apiClientCore';

export const apiClient = createApiClient({
	baseUrl: config.SERVER_URL,
	fetch,
	getAuthentication: () => store.getState().authentication.data,
	setAuthentication: authentication => store.dispatch(setAuthentication(authentication)),
	onForceLogout: () => authEvents.emit('FORCE_LOGOUT'),
});
