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

	const isValidCoord = !isNaN(site.lat) && !isNaN(site.lon);

	return (
		<Link
			href={{
				pathname: '/map',
				params: {
					lat: site.lat,
					lon: site.lon,
					zoom: 16,
					selectedId: site.id,
				},
			}}
			asChild
		>
			<Pressable style={styles.mapContainer}>
				<NativeMap style={styles.map} mapStyle={baseLayer} attribution={false} logo={false}>
					<Camera zoom={13} center={isValidCoord ? [site.lon, site.lat] : undefined} />
					<MapMarkerNative
						key={site.id}
						site={site}
						longitude={site.lon}
						latitude={site.lat}
						selectedSite={site}
						size={24}
						image={site.image}
					/>
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
});
