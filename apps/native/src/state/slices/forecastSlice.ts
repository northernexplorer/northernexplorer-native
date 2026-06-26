import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ForecastType } from '@northernexplorer/types';

type ForecastState = {
  data: ForecastType | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
};

const initialState: ForecastState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {
    setForecast(state, action: PayloadAction<ForecastType>) {
      state.data = action.payload;
      state.lastUpdated = Date.now();
      state.error = null;
    },
    setForecastLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setForecastError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearForecast(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
  },
});

export const { setForecast, setForecastLoading, setForecastError, clearForecast } =
  forecastSlice.actions;

export default forecastSlice.reducer;
