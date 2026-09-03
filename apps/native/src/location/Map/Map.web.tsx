import React, {useState, useRef, useMemo, useCallback} from 'react';
import MapGL, {Marker} from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import useSupercluster from 'use-supercluster';
import {Link, useLocalSearchParams} from 'expo-router';
import {getImageUrl, getUrlSafeString} from '@northernexplorer/tools';
import {PointOfInterestType} from '@northernexplorer/types';
import {BBox} from 'geojson';
import {MapRef} from 'react-map-gl/mapbox-legacy';
import {config} from '~/config';
import {useApiFetch} from '~/core/useApiFetch';
import {useLocation} from '~/location/state/location/useLocation';
import {useMap} from '~/location/state/map/useMap';
import {MapMarkerWeb} from '~/location/Map/components/MapMarkerWeb';

export function Map() {
	const {baseLayer, selectedPoiTypes, visitedFilter} = useMap();
	const mapRef = useRef<MapRef>(null);
	const coords = useLocation();

	const params = useLocalSearchParams<{lat?: string; lon?: string; zoom?: string; selectedId?: string}>();

	const initialLat = params.lat ? parseFloat(params.lat) : (coords?.lat ?? 49.8951);
	const initialLon = params.lon ? parseFloat(params.lon) : (coords?.lon ?? -97.1384);
	const initialZoom = params.zoom ? parseFloat(params.zoom) : 10;

	const [bounds, setBounds] = useState<BBox | undefined>(undefined);
	const [zoom, setZoom] = useState(initialZoom);
	const [selectedSite, setSelectedSite] = useState<PointOfInterestType | null>(null);

	const [mapCenter, setMapCenter] = useState<{lat: number; lon: number}>({
		lat: initialLat,
		lon: initialLon,
	});

	const {data} = useApiFetch('location', 'PointOfInterestController', 'getNearbyPointOfInterests', {
		lat: mapCenter.lat,
		lon: mapCenter.lon,
		limit: 500,
		selectedPoiTypes,
		visitedFilter,
	});

	const points = useMemo(() => {
		if (!data) return [];
		return data.map(site => ({
			type: 'Feature',
			properties: {cluster: false, siteId: site.id, site},
			geometry: {type: 'Point', coordinates: [site.lon, site.lat]},
		}));
	}, [data]);

	const {clusters, supercluster} = useSupercluster({
		points,
		bounds,
		zoom,
		options: {radius: 75, maxZoom: 20},
	});

	const updateMapState = useCallback(() => {
		if (mapRef.current) {
			const b = mapRef.current.getBounds();
			const center = mapRef.current.getCenter();

			const nextBounds: BBox = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];

			setBounds(nextBounds);
			setZoom(mapRef.current.getZoom());

			setMapCenter({
				lat: center.lat,
				lon: center.lng,
			});
		}
	}, []);

	return (
		<div style={{width: '100%', height: '100%', minHeight: '400px'}}>
			<MapGL
				ref={mapRef}
				mapLib={maplibregl}
				initialViewState={{
					longitude: initialLon,
					latitude: initialLat,
					zoom: initialZoom,
				}}
				mapStyle={baseLayer}
				onClick={() => setSelectedSite(null)}
				onLoad={updateMapState}
				onMoveEnd={updateMapState}
				interactiveLayerIds={['pointOfInterestsLayer']}
				cursor={selectedSite ? 'pointer' : 'default'}
				minZoom={2}
			>
				{clusters.map(cluster => {
					const [longitude, latitude] = cluster.geometry.coordinates;
					const {cluster: isCluster, point_count: pointCount} = cluster.properties;

					if (isCluster) {
						return (
							<Marker key={`cluster-${cluster.id}`} longitude={longitude} latitude={latitude} anchor="center">
								<div
									style={styles.clusterMarker}
									onClick={e => {
										e.stopPropagation();
										const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
										mapRef.current?.flyTo({
											center: [longitude, latitude],
											zoom: expansionZoom,
											speed: 1.2,
										});
									}}
								>
									{pointCount}
								</div>
							</Marker>
						);
					}

					const site = cluster.properties.site as PointOfInterestType;
					return (
						<MapMarkerWeb
							key={site.id}
							site={site}
							longitude={longitude}
							latitude={latitude}
							selectedSite={selectedSite}
							setSelectedSite={setSelectedSite}
						/>
					);
				})}

				{selectedSite && (
					<Marker longitude={selectedSite.lon} latitude={selectedSite.lat} anchor="bottom" offset={[0, -60]}>
						<div style={styles.popupContainer}>
							<Link
								href={{
									pathname: '/[country]/[region]/[name]/[id]',
									params: {
										country: getUrlSafeString(selectedSite.country.name),
										region: getUrlSafeString(selectedSite.region.name),
										id: getUrlSafeString(selectedSite.id),
										name: getUrlSafeString(selectedSite.name),
									},
								}}
							>
								{selectedSite.image && (
									<img
										alt={selectedSite.name}
										src={getImageUrl({
											path: selectedSite.image,
											cdn: config.CONTENT_DELIVERY_NETWORK,
										})}
										style={{
											width: '100%',
											height: 120,
											objectFit: 'cover',
											marginBottom: 8,
										}}
									/>
								)}

								<h3 style={styles.popupTitle}>{selectedSite.name}</h3>
								<p style={styles.popupDescription}>{selectedSite.description}</p>
							</Link>

							<div style={styles.popupArrow} />
						</div>
					</Marker>
				)}
			</MapGL>
		</div>
	);
}

const styles = {
	popupContainer: {
		background: '#fff',
		padding: 12,
		boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
		maxWidth: 220,
		textAlign: 'center' as const,
		position: 'relative' as const,
		cursor: 'pointer',
	},
	popupTitle: {
		margin: '0 0 4px',
		fontSize: 14,
		fontWeight: 700,
		color: '#333',
	},
	popupDescription: {
		margin: 0,
		fontSize: 12,
		color: '#666',
	},
	popupArrow: {
		position: 'absolute' as const,
		bottom: -6,
		left: '50%',
		transform: 'translateX(-50%)',
		width: 0,
		height: 0,
		borderLeft: '6px solid transparent',
		borderRight: '6px solid transparent',
		borderTop: '6px solid white',
	},
	iconCircle: {
		width: 52,
		height: 52,
		borderRadius: '50%',
		backgroundColor: '#fff',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
		cursor: 'pointer',
	},
	clusterMarker: {
		width: 44,
		height: 44,
		borderRadius: '50%',
		backgroundColor: '#1e1e1e',
		color: '#fff',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 'bold',
		fontSize: 14,
		boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
		cursor: 'pointer',
	},
};
