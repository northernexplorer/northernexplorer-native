import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CoordinatePayload = {
    lat: number;
    lon: number;
};

type LocationState = {
    data: CoordinatePayload | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
};

const initialState: LocationState = {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLocation(state, action: PayloadAction<CoordinatePayload>) {
            state.data = action.payload;
            state.lastUpdated = Date.now();
            state.error = null;
        },
        setLocationLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setLocationError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearLocation(state) {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.lastUpdated = null;
        },
    },
});

export const {
    setLocation,
    setLocationLoading,
    setLocationError,
    clearLocation,
} = locationSlice.actions;

export default locationSlice.reducer;