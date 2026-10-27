import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PermissionResponse} from '@northernexplorer/types';

type SubscriptionState = {
	data: PermissionResponse | null;
	loading: boolean;
	error: string | null;
	lastUpdated: number | null;
};

const initialState: SubscriptionState = {
	data: null,
	loading: false,
	error: null,
	lastUpdated: null,
};

const subscriptionSlice = createSlice({
	name: 'subscription',
	initialState,
	reducers: {
		setSubscription(state, action: PayloadAction<PermissionResponse | null>) {
			state.data = action.payload;
			state.lastUpdated = Date.now();
			state.error = null;
		},
		setSubscriptionLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setSubscriptionError(state, action: PayloadAction<string | null>) {
			state.error = action.payload;
		},
		clearSubscription(state) {
			state.data = null;
			state.loading = false;
			state.error = null;
			state.lastUpdated = null;
		},
	},
});

export const {setSubscription, setSubscriptionLoading, setSubscriptionError, clearSubscription} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
