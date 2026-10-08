import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MapGL, {Marker, NavigationControl, MapRef, ViewStateChangeEvent} from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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
	const mapRef = useRef<MapRef>(null);

	const isValidCoord = lat !== null && lat !== undefined && lon !== null && lon !== undefined && !isNaN(lat) && !isNaN(lon);

	const initialLat = isValidCoord ? lat : (userCoords?.lat ?? DEFAULT_LAT);
	const initialLon = isValidCoord ? lon : (userCoords?.lon ?? DEFAULT_LON);
	const initialZoom = isValidCoord ? 12 : userCoords?.lat ? 9 : 3.5;

	const [viewState, setViewState] = useState({
		latitude: initialLat,
		longitude: initialLon,
		zoom: initialZoom,
	});

	useEffect(() => {
		if (isValidCoord) {
			setViewState(prev => ({
				...prev,
				latitude: lat,
				longitude: lon,
			}));
		}
	}, [lat, lon, isValidCoord]);

	const handleClick = (e: {lngLat: {lat: number; lng: number}}) => {
		if (disabled) return;
		const clickedLat = e.lngLat.lat;
		const clickedLon = e.lngLat.lng;
		onSelectCoordinates(clickedLat, clickedLon);
	};

	const handleUseCurrentLocation = () => {
		if (userCoords && !disabled) {
			onSelectCoordinates(userCoords.lat, userCoords.lon);
			mapRef.current?.flyTo({
				center: [userCoords.lon, userCoords.lat],
				zoom: 12,
			});
		}
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
					onClick={handleClick}
					cursor={disabled ? 'default' : 'crosshair'}
					style={{width: '100%', height: '100%'}}
				>
					<NavigationControl position="top-right" />
					{isValidCoord && (
						<Marker longitude={lon} latitude={lat} anchor="bottom">
							<View style={styles.markerContainer}>
								<Ionicons name="location" size={36} color="#DC2626" />
							</View>
						</Marker>
					)}
				</MapGL>

				<View style={styles.hintOverlay}>
					<Ionicons name="information-circle-outline" size={16} color="#4B5563" />
					<Text style={styles.hintText}>Click anywhere on the map to set coordinates</Text>
				</View>
			</View>

			<View style={styles.footerRow}>
				<View style={styles.coordDisplay}>
					<Text style={styles.coordLabel}>Selected:</Text>
					<Text style={styles.coordValue}>{isValidCoord ? `${lat.toFixed(6)}, ${lon.toFixed(6)}` : 'None (Click map to select)'}</Text>
				</View>

				{userCoords ? (
					<TouchableOpacity
						style={[styles.locationButton, disabled && styles.disabledButton]}
						onPress={handleUseCurrentLocation}
						disabled={disabled}
					>
						<Ionicons name="locate" size={16} color="#0088cc" />
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
		fontFamily: 'monospace',
		color: '#111827',
		fontWeight: '500',
	},
	locationButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingHorizontal: 10,
		paddingVertical: 6,
		backgroundColor: '#F0F8FF',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#BEE3F8',
	},
	locationButtonText: {
		fontSize: 12,
		color: '#0088cc',
		fontWeight: '600',
	},
	disabledButton: {
		opacity: 0.5,
	},
});
