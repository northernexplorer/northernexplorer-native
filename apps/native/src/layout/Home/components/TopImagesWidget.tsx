import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {ImageType} from '@northernexplorer/types';
import {getImageUrl, ImageView} from '@northernexplorer/tools-web';
import {config} from '~/config';
import {PhotoPreviewModal} from '~/location/PointOfInterestDetails/components/PhotoPreviewModal';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {useIsOffline} from '~/core/ConnectivityProvider';

interface TopImagesWidgetProps {
	data: ImageType[];
}

export function TopImagesWidget({data}: TopImagesWidgetProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const authentication = useAuthentication();
	const {isOffline} = useIsOffline();

	useEffect(() => {
		if (isOffline) {
			setSelectedIndex(null);
		}
	}, [isOffline]);

	const displayData = data.slice(0, 6);
	const selectedImage = !isOffline && selectedIndex !== null ? displayData[selectedIndex] : null;

	const handlePrevious = () => {
		if (selectedIndex !== null && selectedIndex > 0) {
			setSelectedIndex(selectedIndex - 1);
		}
	};

	const handleNext = () => {
		if (selectedIndex !== null && selectedIndex < displayData.length - 1) {
			setSelectedIndex(selectedIndex + 1);
		}
	};

	return (
		<>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
				{displayData.map((item, index) => {
					const imageUri = getImageUrl({
						processed: item.processed,
						size: 'thumbnail',
						path: item.url,
						cdn: config.CONTENT_DELIVERY_NETWORK,
					});

					return (
						<Pressable
							key={item.id}
							disabled={isOffline}
							style={({pressed}) => [{opacity: pressed ? 0.85 : 1}]}
							onPress={() => setSelectedIndex(index)}
						>
							<View style={styles.imageWrapper}>
								<ImageView source={{uri: imageUri}} style={styles.image} resizeMode="cover" />
							</View>
						</Pressable>
					);
				})}
			</ScrollView>

			{selectedImage && selectedIndex !== null && (
				<PhotoPreviewModal
					selectedImageId={selectedImage.id}
					selectedIndex={selectedIndex}
					totalImages={displayData.length}
					isAdmin={false}
					onClose={() => setSelectedIndex(null)}
					onPrevious={handlePrevious}
					onNext={handleNext}
					currentUserId={authentication?.userId}
				/>
			)}
		</>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		gap: 8,
	},
	imageWrapper: {
		width: 120,
		height: 120,
		borderRadius: 8,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
	},
});
