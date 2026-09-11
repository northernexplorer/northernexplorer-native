import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable, LayoutChangeEvent, useWindowDimensions} from 'react-native';
import {ImageType} from '@northernexplorer/types';
import {formatName, getImageUrl} from '@northernexplorer/tools-web';
import {config} from '~/config';
import {PhotoPreviewModal} from '~/location/PointOfInterestDetails/components/PhotoPreviewModal';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';

interface TopImagesWidgetProps {
	data: ImageType[];
	onDelete?: (imageId: string) => void;
}

export function TopImagesWidget({data}: TopImagesWidgetProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [tileSize, setTileSize] = useState<number>(0);
	const {width: windowWidth} = useWindowDimensions();
	const authentication = useAuthentication();

	// 6 columns on tablets/desktop (width >= 600px), 3 columns on mobile
	const columns = windowWidth >= 600 ? 6 : 3;

	const selectedImage = selectedIndex !== null ? data[selectedIndex] : null;

	const handlePrevious = () => {
		if (selectedIndex !== null && selectedIndex > 0) {
			setSelectedIndex(selectedIndex - 1);
		}
	};

	const handleNext = () => {
		if (selectedIndex !== null && selectedIndex < data.length - 1) {
			setSelectedIndex(selectedIndex + 1);
		}
	};

	const handleLayout = (event: LayoutChangeEvent) => {
		const {width} = event.nativeEvent.layout;
		if (width > 0) {
			const gapSize = 6;
			const containerPadding = 24; // 12px padding on each side
			const totalGaps = gapSize * (columns - 1);
			const availableWidth = width - containerPadding - totalGaps;

			setTileSize(Math.floor(availableWidth / columns));
		}
	};

	return (
		<View style={styles.container} onLayout={handleLayout}>
			<View style={styles.galleryGrid}>
				{data.slice(0, 6).map((item, index) => {
					const imageUri = getImageUrl({
						path: item.url,
						cdn: config.CONTENT_DELIVERY_NETWORK,
					});

					const authorName = formatName(item.user);
					const locationName = item.pointOfInterest?.name;

					return (
						<Pressable
							key={item.id}
							style={[
								styles.gridItem,
								tileSize > 0 ? {width: tileSize, height: tileSize} : {width: `${100 / columns - 1.5}%`, aspectRatio: 1},
							]}
							onPress={() => setSelectedIndex(index)}
						>
							<Image source={{uri: imageUri}} style={styles.thumbnail} resizeMode="cover" />

							{locationName && (
								<View style={styles.gridLocationBadge}>
									<Text style={styles.gridBadgeText} numberOfLines={1}>
										{locationName}
									</Text>
								</View>
							)}

							{authorName && (
								<View style={styles.gridAuthorBadge}>
									<Text style={styles.gridBadgeText} numberOfLines={1}>
										{authorName}
									</Text>
								</View>
							)}
						</Pressable>
					);
				})}
			</View>

			{selectedImage && selectedIndex !== null && (
				<PhotoPreviewModal
					selectedImageId={selectedImage.id}
					selectedIndex={selectedIndex}
					totalImages={data.length}
					isAdmin={false}
					onClose={() => setSelectedIndex(null)}
					onPrevious={handlePrevious}
					onNext={handleNext}
					currentUserId={authentication?.userId}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		padding: 12,
		backgroundColor: 'rgba(255, 255, 255, 0.08)',
		borderColor: 'rgba(255, 255, 255, 0.12)',
		borderWidth: 1,
		borderRadius: 16,
	},
	galleryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
	},
	gridItem: {
		borderRadius: 8,
		overflow: 'hidden',
		position: 'relative',
	},
	thumbnail: {
		width: '100%',
		height: '100%',
	},
	gridLocationBadge: {
		position: 'absolute',
		top: 4,
		left: 4,
		alignSelf: 'flex-start',
		maxWidth: '85%',
		backgroundColor: '#0284c7',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	gridAuthorBadge: {
		position: 'absolute',
		bottom: 4,
		left: 4,
		alignSelf: 'flex-start',
		maxWidth: '85%',
		backgroundColor: 'rgba(15, 23, 42, 0.85)',
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	gridBadgeText: {
		color: '#ffffff',
		fontSize: 9,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
});
