import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, Pressable, LayoutChangeEvent, useWindowDimensions} from 'react-native';
import {ImageType} from '@northernexplorer/types';
import {formatName, getDynamicImageUrl, ImageView} from '@northernexplorer/tools-web';
import {config} from '~/config';
import {PhotoPreviewModal} from '~/location/PointOfInterestDetails/components/PhotoPreviewModal';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {styles as globalStyles} from '~/layout/Home/styles';

interface TopImagesWidgetProps {
	data: ImageType[];
	onDelete?: (imageId: string) => void;
}

export function TopImagesWidget({data}: TopImagesWidgetProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [gridWidth, setGridWidth] = useState<number>(0);
	const {width: windowWidth} = useWindowDimensions();
	const authentication = useAuthentication();

	const columns = windowWidth >= 600 ? 6 : 3;

	const tileSize = useMemo(() => {
		if (gridWidth <= 0) return 0;

		const gapSize = 6;
		const totalGaps = gapSize * (columns - 1);
		// Subtract 1 extra pixel safety buffer for sub-pixel Flexbox rounding
		const availableWidth = gridWidth - totalGaps - 1;

		return Math.floor(availableWidth / columns);
	}, [gridWidth, columns]);

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

	const handleGridLayout = (event: LayoutChangeEvent) => {
		const {width} = event.nativeEvent.layout;
		if (width > 0 && Math.abs(width - gridWidth) > 1) {
			setGridWidth(width);
		}
	};

	return (
		<View style={[globalStyles.tile, styles.container]}>
			<View style={styles.galleryGrid} onLayout={handleGridLayout}>
				{data.slice(0, columns).map((item, index) => {
					const imageUri = getDynamicImageUrl({
						processed: item.processed,
						size: 'thumbnail',
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
								tileSize > 0 ? {width: tileSize, height: tileSize} : {width: `${Math.floor(100 / columns) - 2}%`, aspectRatio: 1},
							]}
							onPress={() => setSelectedIndex(index)}
						>
							<ImageView source={{uri: imageUri}} style={styles.thumbnail} resizeMode="cover" />

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
		padding: 12,
		width: '100%',
	},
	galleryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 6,
		width: '100%',
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
