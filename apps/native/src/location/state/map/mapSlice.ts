import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {baseLayers} from '~/location/Map/baseLayers';

export interface MapRasterSource {
	type: 'raster';
	tiles: string[];
	tileSize?: number;
	maxzoom?: number;
	minzoom?: number;
	attribution?: string;
}

export interface MapRasterLayer {
	id: string;
	type: 'raster';
	source: string;
	minzoom?: number;
	maxzoom?: number;
}

export interface MapStyleObject {
	version: 8;
	sources: Record<string, MapRasterSource>;
	layers: MapRasterLayer[];
}

export interface MapState {
	baseLayer: MapStyleObject;
}

const initialState: MapState = {
	baseLayer: baseLayers.standard,
};

export const mapSlice = createSlice({
	name: 'map',
	initialState,
	reducers: {
		setBaseLayer: (state, action: PayloadAction<MapStyleObject>) => {
			state.baseLayer = action.payload;
		},
	},
});

export const {setBaseLayer} = mapSlice.actions;
export default mapSlice.reducer;
