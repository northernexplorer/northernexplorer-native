import {MapStyleObject} from '~/location/state/map/mapSlice';

export const baseLayers: Record<string, MapStyleObject> = {
	standard: {
		version: 8,
		sources: {
			'carto-voyager': {
				type: 'raster',
				tiles: [
					'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
					'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
				],
				tileSize: 256,
				maxzoom: 19,
			},
		},
		layers: [
			{
				id: 'carto-voyager-layer',
				type: 'raster',
				source: 'carto-voyager',
				minzoom: 0,
				maxzoom: 22,
			},
		],
	},
	satellite: {
		version: 8,
		sources: {
			'esri-satellite': {
				type: 'raster',
				tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
				tileSize: 256,
				maxzoom: 19,
			},
		},
		layers: [
			{
				id: 'esri-satellite-layer',
				type: 'raster',
				source: 'esri-satellite',
				minzoom: 0,
				maxzoom: 22,
			},
		],
	},
	terrain: {
		version: 8,
		sources: {
			'esri-topo': {
				type: 'raster',
				tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
				tileSize: 256,
				maxzoom: 19,
			},
		},
		layers: [
			{
				id: 'esri-topo-layer',
				type: 'raster',
				source: 'esri-topo',
				minzoom: 0,
				maxzoom: 22,
			},
		],
	},
};
