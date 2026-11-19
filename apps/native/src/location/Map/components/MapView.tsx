import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NativeSyntheticEvent, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Camera, CameraRef, GeoJSONSource, Layer, Map as NativeMap, Marker, ViewStateChangeEvent} from '@maplibre/maplibre-react-native';
import {useRouter} from 'expo-router';
import {getUrlSafeString} from '@northernexplorer/tools-web';
import {PointOfInterestType} from '@northernexplorer/types';
import {Ionicons} from '@expo/vector-icons';
import {BBox} from 'geojson';
import Supercluster from 'supercluster';
import {MapViewProps} from '../Map';
import {calculateDistance, formatDistance} from '../distance';
import {MapMarkerNative} from '~/location/Map/components/MapMarkerNative';
import {PointOfInterestPreview} from '~/layout/Home/components/PointOfInterestPreviewWidget';
import {useIsOffline} from '~/core/ConnectivityProvider';
import {setMeasuring} from '~/location/state/map/mapSlice';

export function MapView({
	baseLayer,
	clusters,
	supercluster,
	selectedSite,
	setSelectedSite,
	userMarker,
	setUserMarker,
	coords,
	initialLat,
	initialLon,
	initialZoom,
	canAccessRemoteDifficulty,
	canUseDistanceScale,
	measuring,
	updateMapCenterAndBounds,
}: MapViewProps) {
	const router = useRouter();
	const {isOffline} = useIsOffline();
	const cameraRef = useRef<CameraRef>(null);
	const dispatch = useDispatch();
	const [mapHeight, setMapHeight] = useState(0);
	const [measurementPoints, setMeasurementPoints] = useState<[number, number][]>([]);
	useEffect(() => {
		if (!measuring) setMeasurementPoints([]);
	}, [measuring]);

	const onRegionDidChange = useCallback(
		(e: NativeSyntheticEvent<ViewStateChangeEvent>) => {
			const {bounds, zoom, center} = e.nativeEvent;
			if (!Array.isArray(bounds)) return;

			const nextBounds: BBox = [bounds[0], bounds[1], bounds[2], bounds[3]];
			let lat = 0;
			let lon = 0;

			if (Array.isArray(center)) {
				[lon, lat] = center;
			} else if (typeof center === 'object' && 'latitude' in center && 'longitude' in center) {
				lat = (center as {latitude: number; longitude: number}).latitude;
				lon = (center as {latitude: number; longitude: number}).longitude;
			} else {
				lon = (bounds[0] + bounds[2]) / 2;
				lat = (bounds[1] + bounds[3]) / 2;
			}

			updateMapCenterAndBounds(nextBounds, zoom, {lat, lon});
		},
		[updateMapCenterAndBounds],
	);

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
		<View style={{flex: 1}} onLayout={event => setMapHeight(event.nativeEvent.layout.height)}>
			<NativeMap
				style={{width: '100%', height: '100%'}}
				mapStyle={baseLayer}
				scaleBar={canUseDistanceScale && (Platform.OS !== 'android' || mapHeight > 0)}
				scaleBarPosition={Platform.OS === 'android' ? {top: Math.max(0, Math.round(mapHeight - 48)), left: 12} : {bottom: 12, left: 12}}
				onRegionDidChange={onRegionDidChange}
				onPress={event => {
					if (measuring) {
						const [longitude, latitude] = event.nativeEvent.lngLat;
						setMeasurementPoints(points => [...points, [longitude, latitude]]);
						return;
					}
					if (selectedSite) setSelectedSite(null);
					if (userMarker) setUserMarker(false);
				}}
			>
				<Camera ref={cameraRef} zoom={initialZoom} center={[initialLon, initialLat]} />

				{measuring && measurementPoints.length >= 2 && (
					<GeoJSONSource id="measurement-line" data={{type: 'LineString', coordinates: measurementPoints}}>
						<Layer id="measurement-line-layer" type="line" paint={{'line-color': '#0088cc', 'line-width': 3}} />
					</GeoJSONSource>
				)}
				{measuring && measurementPoints.length > 0 && (
					<GeoJSONSource
						id="measurement-points"
						data={{
							type: 'FeatureCollection',
							features: measurementPoints.map(coordinates => ({
								type: 'Feature',
								properties: {},
								geometry: {type: 'Point', coordinates},
							})),
						}}
					>
						<Layer
							id="measurement-points-layer"
							type="circle"
							paint={{'circle-radius': 6, 'circle-color': '#0088cc', 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2}}
						/>
					</GeoJSONSource>
				)}

				{!measuring &&
					clusters.map(cluster => {
						const [longitude, latitude] = cluster.geometry.coordinates;
						const isCluster = 'cluster' in cluster.properties && cluster.properties.cluster;

						if (isCluster) {
							const clusterFeature = cluster as Supercluster.ClusterFeature<Supercluster.AnyProps>;
							const clusterId = clusterFeature.id as number | undefined;
							const pointCount = clusterFeature.properties.point_count;

							return (
								<Marker
									key={`cluster-${clusterId}`}
									lngLat={[longitude, latitude]}
									anchor="center"
									onPress={() => {
										if (!supercluster || clusterId === undefined) return;
										const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId), 20);
										cameraRef.current?.flyTo({
											center: [longitude, latitude],
											zoom: expansionZoom,
											duration: 500,
										});
									}}
								>
									<View style={styles.clusterMarker}>
										<Text style={styles.clusterText}>{pointCount}</Text>
									</View>
								</Marker>
							);
						}

						const site = cluster.properties.site;
						if (!site) return null;

						return (
							<MapMarkerNative
								key={site.id}
								site={site}
								longitude={longitude}
								latitude={latitude}
								selectedSite={selectedSite}
								setSelectedSite={setSelectedSite}
								image={site.image}
								difficulty={site.difficulty}
								canAccessRemoteDifficulty={canAccessRemoteDifficulty}
							/>
						);
					})}

				{!measuring && selectedSite && (
					<Marker
						key={`popup-${selectedSite.id}`}
						lngLat={[selectedSite.lon, selectedSite.lat]}
						anchor="bottom"
						offset={[0, -65]}
						onPress={event => {
							event.stopPropagation();
							if (!isOffline) handleNavigateToSite(selectedSite);
						}}
					>
						<PointOfInterestPreview
							name={selectedSite.name}
							description={selectedSite.description}
							image={selectedSite.image}
							region={selectedSite.region.name}
							latitude={selectedSite.lat}
							longitude={selectedSite.lon}
							rating={selectedSite.rating}
							difficulty={selectedSite.difficulty}
							reviews={selectedSite.reviews}
						/>
					</Marker>
				)}

				{!measuring && coords && (
					<>
						<Marker
							onPress={e => {
								e.stopPropagation();
								setUserMarker(prev => !prev);
								setSelectedSite(null);
							}}
							lngLat={[coords.lon, coords.lat]}
							anchor="center"
						>
							<View style={styles.userLocationMarker}>
								<Ionicons name="person" size={18} color="#ffffff" />
							</View>
						</Marker>

						{userMarker && (
							<Marker lngLat={[coords.lon, coords.lat]} anchor="bottom" offset={[0, -25]}>
								<View style={styles.popupContainer}>
									<Text style={styles.popupTitle}>Your Location</Text>
									<Text style={styles.popupDescription}>{coords.lat}</Text>
									<Text style={styles.popupDescription}>{coords.lon}</Text>
									<View style={styles.popupArrow} />
								</View>
							</Marker>
						)}
					</>
				)}
			</NativeMap>
			{measuring && (
				<View style={styles.measurementControls}>
					<>
						<Text style={styles.measurementDistance}>Distance: {formatDistance(calculateDistance(measurementPoints))}</Text>
						<Text style={styles.measurementHint}>Tap the map to add points</Text>
						<View style={styles.measurementActions}>
							<Pressable accessibilityRole="button" onPress={() => setMeasurementPoints([])} style={styles.measurementButton}>
								<Text style={styles.measurementButtonText}>Clear</Text>
							</Pressable>
							<Pressable
								accessibilityRole="button"
								onPress={() => {
									dispatch(setMeasuring(false));
									setMeasurementPoints([]);
								}}
								style={styles.measurementButton}
							>
								<Text style={styles.measurementButtonText}>Finish</Text>
							</Pressable>
						</View>
					</>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	measurementControls: {
		position: 'absolute',
		top: 12,
		left: 12,
		backgroundColor: '#1e1e1e',
		borderRadius: 10,
		padding: 12,
		elevation: 4,
	},
	measurementDistance: {
		color: '#ffffff',
		fontWeight: '700',
	},
	measurementHint: {
		color: 'rgba(255,255,255,0.72)',
		fontSize: 12,
		marginTop: 4,
	},
	measurementActions: {
		flexDirection: 'row',
		gap: 8,
		marginTop: 8,
	},
	measurementButton: {
		backgroundColor: '#0088cc',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	measurementButtonText: {
		color: '#ffffff',
		fontWeight: '700',
	},
	popupContainer: {
		backgroundColor: '#fff',
		padding: 10,
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
		fontSize: 13,
		fontWeight: '700',
		color: '#333',
		textAlign: 'left',
	},
	popupDescription: {
		margin: 0,
		fontSize: 11,
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
	userLocationMarker: {
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: '#0088cc',
		borderWidth: 2.5,
		borderColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.35,
		shadowRadius: 4,
		elevation: 5,
	},
});
