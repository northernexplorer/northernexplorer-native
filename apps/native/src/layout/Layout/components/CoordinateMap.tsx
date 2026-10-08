import React, {useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Map as NativeMap, Camera, Marker, CameraRef} from '@maplibre/maplibre-react-native';
import {Ionicons} from '@expo/vector-icons';
import {useMap} from '~/location/state/map/useMap';
import {useLocation} from '~/location/state/location/useLocation';

interface Props {
	lat?: number | null;
	lon?: number | null;
	onSelectCoordinates: (lat: number, lon: number) => void;
	disabled?: boolean;
}

const DEFAULT_LAT = 56.1304;
const DEFAULT_LON = -106.3468;

export function CoordinateMap({lat, lon, onSelectCoordinates, disabled}: Props) {
	const {baseLayer} = useMap();
	const userCoords = useLocation();
	const cameraRef = useRef<CameraRef>(null);

	const isValidCoord = lat !== null && lat !== undefined && lon !== null && lon !== undefined && !isNaN(lat) && !isNaN(lon);

	const initialLat = isValidCoord ? lat : (userCoords?.lat ?? DEFAULT_LAT);
	const initialLon = isValidCoord ? lon : (userCoords?.lon ?? DEFAULT_LON);
	const initialZoom = isValidCoord ? 12 : userCoords?.lat ? 9 : 3.5;

	const handlePress: React.ComponentProps<typeof NativeMap>['onPress'] = event => {
		if (disabled) return;
		const payload = 'nativeEvent' in event ? event.nativeEvent : event;
		if (typeof payload === 'object' && 'geometry' in payload) {
			const geo = (payload as {geometry?: {coordinates?: unknown}}).geometry;
			if (geo && typeof geo === 'object' && 'coordinates' in geo && Array.isArray(geo.coordinates) && geo.coordinates.length >= 2) {
				const [clickedLon, clickedLat] = geo.coordinates;
				if (typeof clickedLat === 'number' && typeof clickedLon === 'number') {
					onSelectCoordinates(clickedLat, clickedLon);
				}
			}
		}
	};

	const handleUseCurrentLocation = () => {
		if (userCoords && !disabled) {
			onSelectCoordinates(userCoords.lat, userCoords.lon);
			cameraRef.current?.flyTo({
				center: [userCoords.lon, userCoords.lat],
				zoom: 12,
			});
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.mapWrapper}>
				<NativeMap style={styles.map} mapStyle={baseLayer} onPress={handlePress} attribution={false} logo={false}>
					<Camera ref={cameraRef} zoom={initialZoom} center={isValidCoord ? [lon, lat] : [initialLon, initialLat]} />
					{isValidCoord && (
						<Marker lngLat={[lon, lat]} anchor="bottom">
							<View style={styles.markerContainer}>
								<Ionicons name="location" size={36} color="#DC2626" />
							</View>
						</Marker>
					)}
				</NativeMap>

				<View style={styles.hintOverlay}>
					<Ionicons name="information-circle-outline" size={16} color="#4B5563" />
					<Text style={styles.hintText}>Tap anywhere on the map to set coordinates</Text>
				</View>
			</View>

			<View style={styles.footerRow}>
				<View style={styles.coordDisplay}>
					<Text style={styles.coordLabel}>Selected:</Text>
					<Text style={styles.coordValue}>{isValidCoord ? `${lat.toFixed(6)}, ${lon.toFixed(6)}` : 'None (Tap map to select)'}</Text>
				</View>

				{userCoords ? (
					<TouchableOpacity
						style={[styles.locationButton, disabled && styles.disabledButton]}
						onPress={handleUseCurrentLocation}
						disabled={disabled}
					>
						<Ionicons name="locate" size={16} color="#2563EB" />
						<Text style={styles.locationButtonText}>My Location</Text>
					</TouchableOpacity>
				) : null}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		gap: 8,
	},
	mapWrapper: {
		width: '100%',
		height: 280,
		borderRadius: 8,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#D1D5DB',
		position: 'relative',
	},
	map: {
		flex: 1,
	},
	markerContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	hintOverlay: {
		position: 'absolute',
		top: 10,
		left: 10,
		backgroundColor: 'rgba(255, 255, 255, 0.92)',
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 6,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 2,
	},
	hintText: {
		fontSize: 12,
		color: '#4B5563',
		fontWeight: '500',
	},
	footerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		gap: 8,
	},
	coordDisplay: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	coordLabel: {
		fontSize: 13,
		fontWeight: '600',
		color: '#4B5563',
	},
	coordValue: {
		fontSize: 13,
		color: '#111827',
		fontWeight: '500',
	},
	locationButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 10,
		paddingVertical: 6,
		backgroundColor: '#EFF6FF',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#BFDBFE',
	},
	locationButtonText: {
		fontSize: 12,
		color: '#2563EB',
		fontWeight: '600',
	},
	disabledButton: {
		opacity: 0.5,
	},
});
