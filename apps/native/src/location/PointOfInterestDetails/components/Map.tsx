import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Map as NativeMap, Camera} from '@maplibre/maplibre-react-native';
import {PointOfInterestType} from '@northernexplorer/types';
import {Link} from 'expo-router';
import {useMap} from '~/location/state/map/useMap';
import {MapMarkerNative} from '~/location/Map/components/MapMarkerNative';

interface Props {
	site: PointOfInterestType;
}

export function Map({site}: Props) {
	const {baseLayer} = useMap();

	return (
		<Link
			href={{
				pathname: '/map',
				params: {
					lat: site.lat,
					lon: site.lon,
					zoom: 15,
					selectedId: site.id,
				},
			}}
			asChild
		>
			<Pressable style={styles.mapContainer}>
				<NativeMap style={styles.map} mapStyle={baseLayer} attribution={false} logo={false}>
					<Camera zoom={13} center={[site.lon, site.lat]} />
					<MapMarkerNative key={site.id} site={site} longitude={site.lon} latitude={site.lat} selectedSite={site} size={24} />
				</NativeMap>
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
