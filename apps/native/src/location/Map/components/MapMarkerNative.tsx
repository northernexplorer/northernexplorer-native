import React, {Dispatch, SetStateAction} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Marker} from '@maplibre/maplibre-react-native';
import {ImageHeaderType, PointOfInterestType} from '@northernexplorer/types';
import {getImageUrl} from '@northernexplorer/tools-web';
import {config} from '~/config';

interface Props {
	site: PointOfInterestType;
	longitude: number;
	latitude: number;
	selectedSite?: PointOfInterestType | null;
	setSelectedSite?: Dispatch<SetStateAction<PointOfInterestType | null>>;
	size?: number;
	image: ImageHeaderType;
}

export function MapMarkerNative({site, longitude, latitude, selectedSite, setSelectedSite, size, image}: Props) {
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
						width: markerSize,
						height: markerSize,
						borderRadius: markerSize / 2,
						borderColor: isDraft ? '#e65100' : '#FFFFFF',
						borderStyle: isDraft ? 'dashed' : 'solid',
						opacity: isDraft ? 0.85 : 1,
					},
				]}
			>
				<Image
					source={{
						uri: getImageUrl({path: image.url, size: 'thumbnail', cdn: config.CONTENT_DELIVERY_NETWORK, processed: image.processed}),
					}}
					style={styles.image}
					resizeMode="cover"
				/>

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
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
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
		zIndex: 1,
	},
	draftText: {
		color: '#FFFFFF',
		fontSize: 9,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		includeFontPadding: false,
	},
});
