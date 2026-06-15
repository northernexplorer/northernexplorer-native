import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWeather = createAsyncThunk(
    "weather/fetch",
    async ({ lat, lon }: { lat: number; lon: number }) => {
        const res = await fetch(
            `https://api.openweathermap.org/...`
        );

        return res.json();
    }
);

interface WeatherState {
    data: any | null;
    loading: boolean;
}

const initialState: WeatherState = {
    data: null,
    loading: false,
};

const weatherSlice = createSlice({
    name: "weather",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWeather.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchWeather.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default weatherSlice.reducer;