import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import MapGL from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import {Link} from 'expo-router';
import {PointOfInterestType} from '@northernexplorer/types';
import {useMap} from '~/location/state/map/useMap';
import {MapMarkerWeb} from '~/location/Map/components/MapMarkerWeb';

interface Props {
	site: PointOfInterestType;
}

export function Map({site}: Props) {
	const {baseLayer} = useMap();

	return (
		<Link href="/map" asChild>
			<Pressable style={styles.mapContainer}>
				<MapGL
					initialViewState={{
						longitude: site.lon,
						latitude: site.lat,
						zoom: 9,
					}}
					style={{width: '100%', height: '100%', pointerEvents: 'none'}}
					mapStyle={baseLayer}
					attributionControl={false}
				>
					<MapMarkerWeb key={site.id} site={site} longitude={site.lon} latitude={site.lat} selectedSite={site} size={24} />
				</MapGL>
			</Pressable>
		</Link>
	);
}

const styles = StyleSheet.create({
	mapContainer: {
		width: '100%',
		height: '100%',
	},
	map: {
		flex: 1,
	},
	popupContainer: {
		backgroundColor: '#fff',
		padding: 12,
		boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
		maxWidth: 220,
		textAlign: 'center' as const,
		position: 'relative' as const,
		cursor: 'pointer',
	},
	popupTitle: {
		fontSize: 14,
		fontWeight: 700,
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
});
