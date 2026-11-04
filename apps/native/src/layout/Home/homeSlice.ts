import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ImageType, PointOfInterestType} from '@northernexplorer/types';

export type HomeState = {
	nearbyLocations: PointOfInterestType[] | null;
	newestLocations: PointOfInterestType[] | null;
	topImages: ImageType[] | null;
};

const initialState: HomeState = {
	nearbyLocations: null,
	newestLocations: null,
	topImages: null,
};

const homeSlice = createSlice({
	name: 'home',
	initialState,
	reducers: {
		setNearbyLocations(state, action: PayloadAction<PointOfInterestType[]>) {
			state.nearbyLocations = action.payload;
		},
		setNewestLocations(state, action: PayloadAction<PointOfInterestType[]>) {
			state.newestLocations = action.payload;
		},
		setTopImages(state, action: PayloadAction<ImageType[]>) {
			state.topImages = action.payload;
		},
	},
});

export const {setNearbyLocations, setNewestLocations, setTopImages} = homeSlice.actions;

export function selectHomeData<T>(fetchedData: T | null | undefined, cachedData: T | null): T | null {
	return fetchedData ?? cachedData;
}

export default homeSlice.reducer;
