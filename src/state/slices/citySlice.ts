import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {CityType} from "~/state/hooks/city/getCity";

type CityState = {
    data: CityType | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
};

const initialState: CityState = {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

const citySlice = createSlice({
    name: "city",
    initialState,
    reducers: {
        setCity(state, action: PayloadAction<CityType>) {
            state.data = action.payload;
            state.lastUpdated = Date.now();
            state.error = null;
        },
        setCityLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setCityError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearCity(state) {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.lastUpdated = null;
        },
    },
});

export const {
    setCity,
    setCityLoading,
    setCityError,
    clearCity,
} = citySlice.actions;

export default citySlice.reducer;