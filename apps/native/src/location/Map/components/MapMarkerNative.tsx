import React, {Dispatch, SetStateAction} from 'react';
import {StyleSheet, View} from 'react-native';
import {Marker} from '@maplibre/maplibre-react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {PointOfInterestType} from '@northernexplorer/types';
import {getMarkerConfig} from './getMarkerConfig';

interface Props {
	site: PointOfInterestType;
	longitude: number;
	latitude: number;
	selectedSite: PointOfInterestType | null;
	setSelectedSite: Dispatch<SetStateAction<PointOfInterestType | null>>;
}

export function MapMarkerNative({site, longitude, latitude, selectedSite, setSelectedSite}: Props) {
	const {iconName, backgroundColor} = getMarkerConfig(site.type);

	return (
		<Marker
			key={site.id}
			lngLat={[longitude, latitude]}
			anchor="bottom"
			onPress={e => {
				e.stopPropagation();
				if (selectedSite && selectedSite.id === site.id) {
					setSelectedSite(null);
				} else {
					setSelectedSite(site);
				}
			}}
		>
			<View style={[styles.iconCircle, {backgroundColor}]}>
				<MaterialCommunityIcons name={iconName} size={28} color="#FFFFFF" />
			</View>
		</Marker>
	);
}

const styles = StyleSheet.create({
	iconCircle: {
		width: 48,
		height: 48,
		borderRadius: 24,
		borderWidth: 2,
		borderColor: '#FFFFFF',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 4,
	},
});
