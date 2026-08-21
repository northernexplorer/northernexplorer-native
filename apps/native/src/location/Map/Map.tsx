import React, {useState, useMemo, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, Image, NativeSyntheticEvent} from 'react-native';
import {Map as NativeMap, Camera, Marker, CameraRef, ViewStateChangeEvent} from '@maplibre/maplibre-react-native';
import useSupercluster from 'use-supercluster';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {getUrl, getUrlSafeString} from '@northernexplorer/tools';
import {PointOfInterestType} from '@northernexplorer/types';
import {BBox} from 'geojson';
import {config} from '~/config';
import {useApiFetch} from '~/core/useApiFetch';
import {useLocation} from '~/location/state/location/useLocation';
import {useMap} from '~/location/state/map/useMap';
import {MapMarkerNative} from '~/location/Map/components/MapMarkerNative';

export function Map() {
	const router = useRouter();
	const {baseLayer} = useMap();
	const cameraRef = useRef<CameraRef>(null);

	const params = useLocalSearchParams<{lat?: string; lon?: string; zoom?: string; selectedId?: string}>();

	const coords = useLocation();

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

	const onRegionDidChange = useCallback((e: NativeSyntheticEvent<ViewStateChangeEvent>) => {
		const {bounds, zoom, center} = e.nativeEvent;

		if (!Array.isArray(bounds)) return;

		const newBounds: BBox = [bounds[0], bounds[1], bounds[2], bounds[3]];

		setBounds(newBounds);
		setZoom(zoom);

		if (Array.isArray(center)) {
			const [lon, lat] = center;
			setMapCenter({lat, lon});
		} else {
			// Fallback calculation using bounding box center
			const lon = (bounds[0] + bounds[2]) / 2;
			const lat = (bounds[1] + bounds[3]) / 2;
			setMapCenter({lat, lon});
		}
	}, []);

	const handleNavigateToSite = useCallback(
		(site: PointOfInterestType) => {
			router.push({
				pathname: '/[country]/[region]/[name]/[id]',
				params: {
					country: getUrlSafeString(site.country.name),
					region: getUrlSafeString(site.region.name),
					id: getUrlSafeString(site.id),
					name: getUrlSafeString(site.name),
				},
			});
		},
		[router],
	);

	return (
		<View style={{flex: 1}}>
			<NativeMap
				style={{width: '100%', height: '100%'}}
				mapStyle={baseLayer}
				onRegionDidChange={onRegionDidChange}
				onPress={() => {
					if (selectedSite) setSelectedSite(null);
				}}
			>
				<Camera ref={cameraRef} zoom={initialZoom} center={[initialLon, initialLat]} />

				{clusters.map(cluster => {
					const [longitude, latitude] = cluster.geometry.coordinates;
					const {cluster: isCluster, point_count} = cluster.properties;

					if (isCluster) {
						return (
							<Marker
								key={`cluster-${cluster.id}`}
								lngLat={[longitude, latitude]}
								anchor="center"
								onPress={() => {
									const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);

									if (cameraRef.current) {
										cameraRef.current.flyTo({
											center: [longitude, latitude],
											zoom: expansionZoom,
											duration: 500,
										});
									}
								}}
							>
								<View style={styles.clusterMarker}>
									<Text style={styles.clusterText}>{point_count}</Text>
								</View>
							</Marker>
						);
					}

					const site = cluster.properties.site as PointOfInterestType;
					return (
						<MapMarkerNative
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
					<Marker
						key={`popup-${selectedSite.id}`}
						lngLat={[selectedSite.lon, selectedSite.lat]}
						anchor="bottom"
						offset={[0, -65]}
						onPress={() => handleNavigateToSite(selectedSite)}
						style={{cursor: 'pointer'}}
					>
						<View style={styles.popupContainer}>
							{selectedSite.image && (
								<Image
									source={{
										uri: getUrl({
											path: selectedSite.image,
											serverUrl: config.SERVER_URL,
										}),
									}}
									style={styles.popupImage}
								/>
							)}

							<View style={styles.popupContent}>
								<Text style={styles.popupTitle}>{selectedSite.name}</Text>
								<Text style={styles.popupDescription}>{selectedSite.description}</Text>
							</View>

							<View style={styles.popupArrow} />
						</View>
					</Marker>
				)}
			</NativeMap>
		</View>
	);
}

const styles = StyleSheet.create({
	popupContainer: {
		backgroundColor: '#fff',
		padding: 12,
		width: 220,
		position: 'relative',
		alignItems: 'flex-start',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 10,
		elevation: 5,
	},
	popupTitle: {
		fontSize: 14,
		fontWeight: '700',
		color: '#333',
		textAlign: 'left',
		marginTop: 8,
	},
	popupDescription: {
		margin: 0,
		fontSize: 12,
		color: '#666',
	},
	popupArrow: {
		position: 'absolute',
		bottom: -6,
		left: '50%',
		width: 0,
		height: 0,
		borderLeftWidth: 6,
		borderRightWidth: 6,
		borderTopWidth: 6,
		borderLeftColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: '#ffffff',
	},
	popupImage: {
		width: '100%',
		height: 120,
		marginBottom: 8,
	},
	popupContent: {
		flexDirection: 'column',
	},
	iconCircle: {
		width: 52,
		height: 52,
		borderRadius: 26,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	clusterMarker: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: '#1e1e1e',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
	clusterText: {
		color: '#fff',
		fontWeight: '700',
		fontSize: 16,
	},
});
