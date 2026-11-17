import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PointOfInterestTypeEnum, VisitedFilterEnum} from '@northernexplorer/types';
import {baseLayers} from '~/location/Map/baseLayers';
import {COST_OPTIONS} from '~/location/PointOfInterestDetails/components/reviewOptions';

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
	selectedPoiTypes: PointOfInterestTypeEnum[];
	visitedFilter: VisitedFilterEnum;
	minRating: number | null;
	minDifficultyIndex: number;
	maxDifficultyIndex: number | null;
	minCostIndex: number;
	maxCostIndex: number;
	showDrafts: boolean;
}

const initialState: MapState = {
	baseLayer: baseLayers.standard,
	selectedPoiTypes: [],
	visitedFilter: VisitedFilterEnum.All,
	minRating: null,
	minDifficultyIndex: 0,
	maxDifficultyIndex: null,
	minCostIndex: 0,
	maxCostIndex: COST_OPTIONS.length - 1,
	showDrafts: false,
};

export const mapSlice = createSlice({
	name: 'map',
	initialState,
	reducers: {
		setBaseLayer: (state, action: PayloadAction<MapStyleObject>) => {
			state.baseLayer = action.payload;
		},
		setPoiTypes: (state, action: PayloadAction<PointOfInterestTypeEnum[]>) => {
			state.selectedPoiTypes = action.payload;
		},
		setVisitedFilter: (state, action: PayloadAction<VisitedFilterEnum>) => {
			state.visitedFilter = action.payload;
		},
		setMinRating: (state, action: PayloadAction<number | null>) => {
			state.minRating = action.payload;
		},
		setMinDifficultyLevel: (state, action: PayloadAction<number>) => {
			state.minDifficultyIndex = action.payload;
		},
		setMaxDifficultyLevel: (state, action: PayloadAction<number>) => {
			state.maxDifficultyIndex = action.payload;
		},
		setDifficultyLevel: (state, action: PayloadAction<number>) => {
			state.maxDifficultyIndex = action.payload;
		},
		setMinCostLevel: (state, action: PayloadAction<number>) => {
			state.minCostIndex = action.payload;
		},
		setMaxCostLevel: (state, action: PayloadAction<number>) => {
			state.maxCostIndex = action.payload;
		},
		setCostLevel: (state, action: PayloadAction<number>) => {
			state.maxCostIndex = action.payload;
		},
		setShowDrafts: (state, action: PayloadAction<boolean>) => {
			state.showDrafts = action.payload;
		},
	},
});

export const {
	setBaseLayer,
	setPoiTypes,
	setVisitedFilter,
	setMinRating,
	setMinDifficultyLevel,
	setMaxDifficultyLevel,
	setDifficultyLevel,
	setMinCostLevel,
	setMaxCostLevel,
	setCostLevel,
	setShowDrafts,
} = mapSlice.actions;

export default mapSlice.reducer;
