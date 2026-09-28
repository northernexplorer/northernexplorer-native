import React, {Dispatch, SetStateAction} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Marker} from '@maplibre/maplibre-react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {ImageHeaderType, PointOfInterestType, SiteDifficultyEnum} from '@northernexplorer/types';
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
	difficulty?: SiteDifficultyEnum;
	canAccessOffTrailDifficulty?: boolean;
	canAccessExpeditionDifficulty?: boolean;
}

export function MapMarkerNative({
	site,
	longitude,
	latitude,
	selectedSite,
	setSelectedSite,
	size,
	image,
	difficulty,
	canAccessOffTrailDifficulty = false,
	canAccessExpeditionDifficulty = false,
}: Props) {
	const isDraft = site.status === 'Draft';
	const markerSize = size || 48;

	const isOffTrail = difficulty === SiteDifficultyEnum.OFF_TRAIL_REMOTE;
	const isExpedition = difficulty === SiteDifficultyEnum.EXPEDITION_ONLY;

	const isLocked = (isOffTrail && !canAccessOffTrailDifficulty) || (isExpedition && !canAccessExpeditionDifficulty);

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
						borderColor: isDraft ? '#e65100' : isLocked ? '#e67e22' : '#FFFFFF',
						borderStyle: isDraft ? 'dashed' : 'solid',
						backgroundColor: isLocked ? '#fff5ec' : '#FFFFFF',
						opacity: isDraft ? 0.85 : 1,
					},
				]}
			>
				{isLocked ? (
					<MaterialCommunityIcons name="lock" size={markerSize * 0.45} color="#e67e22" />
				) : (
					<Image
						source={{
							uri: getImageUrl({
								path: image.url,
								size: 'thumbnail',
								cdn: config.CONTENT_DELIVERY_NETWORK,
								processed: image.processed,
							}),
						}}
						style={styles.image}
						resizeMode="cover"
					/>
				)}

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
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#e65100',
		paddingVertical: 1,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1,
	},
	draftText: {
		color: '#FFFFFF',
		fontSize: 8,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		includeFontPadding: false,
	},
});
