import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeatherType } from '~/state/hooks/weather/getWeather';

export type WeatherState = {
  data: WeatherType | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
};

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeather(state, action: PayloadAction<WeatherType>) {
      state.data = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    setWeatherLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setWeatherError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearWeather(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
});

export const { setWeather, setWeatherLoading, setWeatherError, clearWeather } =
  weatherSlice.actions;

export default weatherSlice.reducer;
