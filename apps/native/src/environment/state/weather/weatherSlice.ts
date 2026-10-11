import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {WeatherType, WeatherWarningType} from '@northernexplorer/types';

export type WeatherState = {
	data: WeatherType | null;
	warnings?: WeatherWarningType[];
	loading: boolean;
	error: string | null;
	lastUpdated: number | null;
	warningsLastUpdated: number | null;
};

const initialState: WeatherState = {
	data: null,
	warnings: [],
	loading: false,
	error: null,
	lastUpdated: null,
	warningsLastUpdated: null,
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
		setWeatherWarnings(state, action: PayloadAction<WeatherWarningType[]>) {
			state.warnings = action.payload;
			state.warningsLastUpdated = Date.now();
		},
		setWeatherLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setWeatherError(state, action: PayloadAction<string | null>) {
			state.error = action.payload;
		},
		clearWeather(state) {
			state.data = null;
			state.warnings = [];
			state.loading = false;
			state.error = null;
			state.lastUpdated = null;
			state.warningsLastUpdated = null;
		},
	},
});

export const {setWeather, setWeatherWarnings, setWeatherLoading, setWeatherError, clearWeather} = weatherSlice.actions;

export default weatherSlice.reducer;
