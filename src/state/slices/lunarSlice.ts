import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LunarState = {
    data: any | null;
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
};

const initialState: LunarState = {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
};

const lunarSlice = createSlice({
    name: "lunar",
    initialState,
    reducers: {
        setLunar(state, action: PayloadAction<any>) {
            state.data = action.payload;
            state.lastUpdated = Date.now();
            state.error = null;
        },
        setLunarLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setLunarError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearLunar(state) {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.lastUpdated = null;
        },
    },
});

export const {
    setLunar,
    setLunarLoading,
    setLunarError,
    clearLunar,
} = lunarSlice.actions;

export default lunarSlice.reducer;