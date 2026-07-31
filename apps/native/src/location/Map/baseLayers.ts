import {MapStyleObject} from '~/location/state/map/mapSlice';
import {config} from '~/config';

const apiKey = config.EXPO_PUBLIC_ARCGIS_API_KEY;

export const baseLayers: Record<string, MapStyleObject> = {
	standard: {
		version: 8,
		sources: {
			'esri-navigation': {
				type: 'raster',
				tiles: [
					`https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/v1/arcgis/navigation/static/tile/{z}/{y}/{x}?token=${apiKey}`,
				],
				tileSize: 256,
				maxzoom: 19,
				attribution: 'Tiles &copy; Esri, HERE, Garmin, FAO, NOAA, USGS',
			},
		},
		layers: [
			{
				id: 'esri-navigation-layer',
				type: 'raster',
				source: 'esri-navigation',
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
				tiles: [`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${apiKey}`],
				tileSize: 256,
				maxzoom: 19,
				attribution:
					'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
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
				tiles: [`https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}?token=${apiKey}`],
				tileSize: 256,
				maxzoom: 19,
				attribution:
					'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
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
