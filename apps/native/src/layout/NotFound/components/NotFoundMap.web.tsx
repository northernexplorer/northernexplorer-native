import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import MapGL, {Marker, NavigationControl, MapRef, ViewStateChangeEvent} from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';
import {useMap} from '~/location/state/map/useMap';
import {useLocation} from '~/location/state/location/useLocation';

const DEFAULT_LAT = 56.1304;
const DEFAULT_LON = -106.3468;

export function NotFoundMap() {
	const router = useRouter();
	const {baseLayer} = useMap();
	const userCoords = useLocation();
	const mapRef = useRef<MapRef>(null);

	const centerLat = userCoords?.lat ?? DEFAULT_LAT;
	const centerLon = userCoords?.lon ?? DEFAULT_LON;

	const [viewState, setViewState] = useState({
		latitude: centerLat,
		longitude: centerLon,
		zoom: 4,
	});

	const handleOpenMap = () => {
		router.push('/map');
	};

	return (
		<View style={styles.container}>
			<View style={styles.mapWrapper}>
				<MapGL
					ref={mapRef}
					{...viewState}
					onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
					mapLib={maplibregl}
					mapStyle={baseLayer}
					cursor="grab"
					style={{width: '100%', height: '100%'}}
				>
					<NavigationControl position="top-right" />

					<Marker longitude={centerLon} latitude={centerLat} anchor="bottom">
						<View style={styles.markerWrapper}>
							<View style={styles.markerBadge}>
								<MaterialCommunityIcons name="compass-rose" size={14} color="#0284c7" />
								<Text style={styles.markerBadgeText}>You Are Here</Text>
							</View>
							<View style={styles.pulseContainer}>
								<View style={styles.pulseRing} />
								<View style={styles.pinCircle}>
									<MaterialCommunityIcons name="map-marker-question" size={28} color="#ffffff" />
								</View>
							</View>
						</View>
					</Marker>
				</MapGL>

				{/* Compass Floating Header */}
				<View style={styles.compassOverlay}>
					<View style={styles.compassBadge}>
						<MaterialCommunityIcons name="compass-outline" size={20} color="#0284c7" />
						<Text style={styles.compassText}>Compass Bearing: Lost in the Wild</Text>
					</View>
				</View>

				{/* Map CTA Button */}
				<Pressable
					onPress={handleOpenMap}
					style={({pressed}) => [styles.exploreMapButton, pressed && styles.buttonPressed]}
					accessibilityRole="button"
					accessibilityLabel="Open Full Interactive Map"
				>
					<Ionicons name="map" size={16} color="#ffffff" />
					<Text style={styles.exploreMapButtonText}>Open Interactive Map</Text>
				</Pressable>

				{/* Coordinates Footer */}
				<View style={styles.coordsFooter}>
					<MaterialCommunityIcons name="crosshairs-gps" size={14} color="#64748b" />
					<Text style={styles.coordsText}>
						{viewState.latitude.toFixed(4)}° N, {Math.abs(viewState.longitude).toFixed(4)}° W • Off-Trail Territory
					</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		marginVertical: 16,
	},
	mapWrapper: {
		width: '100%',
		height: 380,
		borderRadius: 16,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		position: 'relative',
		backgroundColor: '#f1f5f9',
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 4},
		shadowOpacity: 0.08,
		shadowRadius: 10,
		elevation: 4,
	},
	markerWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	markerBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#bae6fd',
		marginBottom: 4,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.15,
		shadowRadius: 4,
		elevation: 3,
	},
	markerBadgeText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#0369a1',
	},
	pulseContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	pulseRing: {
		position: 'absolute',
		width: 48,
		height: 48,
		borderRadius: 24,
		backgroundColor: 'rgba(2, 132, 199, 0.25)',
	},
	pinCircle: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: '#0284c7',
		borderWidth: 2,
		borderColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 4,
	},
	compassOverlay: {
		position: 'absolute',
		top: 12,
		left: 12,
		zIndex: 10,
	},
	compassBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: 'rgba(255, 255, 255, 0.94)',
		paddingHorizontal: 12,
		paddingVertical: 7,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.12,
		shadowRadius: 4,
		elevation: 3,
	},
	compassText: {
		fontSize: 12,
		fontWeight: '700',
		color: '#0f172a',
	},
	exploreMapButton: {
		position: 'absolute',
		bottom: 12,
		right: 12,
		zIndex: 10,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: '#0284c7',
		paddingHorizontal: 14,
		paddingVertical: 9,
		borderRadius: 12,
		shadowColor: '#0284c7',
		shadowOffset: {width: 0, height: 3},
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 4,
	},
	exploreMapButtonText: {
		color: '#ffffff',
		fontSize: 13,
		fontWeight: '600',
	},
	coordsFooter: {
		position: 'absolute',
		bottom: 12,
		left: 12,
		zIndex: 10,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: 'rgba(255, 255, 255, 0.92)',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	coordsText: {
		fontSize: 11,
		fontWeight: '600',
		color: '#475569',
	},
	buttonPressed: {
		opacity: 0.85,
		transform: [{scale: 0.98}],
	},
});
