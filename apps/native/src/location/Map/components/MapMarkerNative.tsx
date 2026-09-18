import React, {Dispatch, SetStateAction} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Marker} from '@maplibre/maplibre-react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {PointOfInterestType} from '@northernexplorer/types';
import {getMarkerConfig} from './getMarkerConfig';

interface Props {
	site: PointOfInterestType;
	longitude: number;
	latitude: number;
	selectedSite?: PointOfInterestType | null;
	setSelectedSite?: Dispatch<SetStateAction<PointOfInterestType | null>>;
	size?: number;
}

export function MapMarkerNative({site, longitude, latitude, selectedSite, setSelectedSite, size}: Props) {
	const {iconName, backgroundColor} = getMarkerConfig(site.type);
	const isDraft = site.status === 'Draft';
	const markerSize = size || 48;

	return (
		<Marker
			key={site.id}
			lngLat={[longitude, latitude]}
			anchor="bottom"
			onPress={e => {
				e.stopPropagation();
				if (setSelectedSite) {
					if (selectedSite && selectedSite.id === site.id) {
						setSelectedSite(null);
					} else {
						setSelectedSite(site);
					}
				}
			}}
		>
			<View
				style={[
					styles.iconCircle,
					{
						backgroundColor,
						width: markerSize,
						height: markerSize,
						borderRadius: markerSize / 2,
						borderColor: isDraft ? '#e65100' : '#FFFFFF',
						borderStyle: isDraft ? 'dashed' : 'solid',
						opacity: isDraft ? 0.85 : 1,
					},
				]}
			>
				<MaterialCommunityIcons name={iconName} size={size ? size / 2 : 28} color="#FFFFFF" />

				{isDraft && (
					<View style={styles.draftBadge}>
						<Text style={styles.draftText}>DRAFT</Text>
					</View>
				)}
			</View>
		</Marker>
	);
}

const styles = StyleSheet.create({
	iconCircle: {
		borderWidth: 2,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 2},
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 4,
		position: 'relative',
	},
	draftBadge: {
		position: 'absolute',
		bottom: -6,
		backgroundColor: '#e65100',
		paddingHorizontal: 4,
		paddingVertical: 1,
		borderRadius: 4,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.3,
		shadowRadius: 2,
		elevation: 2,
	},
	draftText: {
		color: '#FFFFFF',
		fontSize: 9,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		includeFontPadding: false,
	},
});
