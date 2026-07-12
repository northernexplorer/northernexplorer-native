import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserAuthenticationType} from '@northernexplorer/types';

type AuthenticationState = {
	data: UserAuthenticationType | null;
	loading: boolean;
	error: string | null;
	lastUpdated: number | null;
};

const initialState: AuthenticationState = {
	data: null,
	loading: false,
	error: null,
	lastUpdated: null,
};

const authenticationSlice = createSlice({
	name: 'authentication',
	initialState,
	reducers: {
		setAuthentication(state, action: PayloadAction<UserAuthenticationType>) {
			state.data = action.payload;
			state.lastUpdated = Date.now();
			state.error = null;
		},
		setAuthenticationLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setAuthenticationError(state, action: PayloadAction<string | null>) {
			state.error = action.payload;
		},
		clearAuthentication(state) {
			state.data = null;
			state.loading = false;
			state.error = null;
			state.lastUpdated = null;
		},
	},
});

export const {setAuthentication, setAuthenticationLoading, setAuthenticationError, clearAuthentication} = authenticationSlice.actions;

export default authenticationSlice.reducer;
