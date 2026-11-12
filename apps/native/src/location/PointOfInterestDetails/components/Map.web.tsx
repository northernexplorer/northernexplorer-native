import React, {useState, useEffect} from 'react';
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

	const [viewState, setViewState] = useState({
		longitude: site.lon,
		latitude: site.lat,
		zoom: 9,
	});

	useEffect(() => {
		if (!isNaN(site.lat) && !isNaN(site.lon)) {
			setViewState(prev => ({
				...prev,
				latitude: site.lat,
				longitude: site.lon,
			}));
		}
	}, [site.lat, site.lon]);

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
				<MapGL {...viewState} style={{width: '100%', height: '100%', pointerEvents: 'none'}} mapStyle={baseLayer} attributionControl={false}>
					<MapMarkerWeb
						key={site.id}
						site={site}
						longitude={site.lon}
						latitude={site.lat}
						selectedSite={site}
						size={24}
						image={site.image}
					/>
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
});
