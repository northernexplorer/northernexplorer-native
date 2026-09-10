import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ImageType} from '@northernexplorer/types';
import {PhotoGridItem} from '~/location/PointOfInterestDetails/components/PhotoGridItem';
import {PhotoPreviewModal} from '~/location/PointOfInterestDetails/components/PhotoPreviewModal';

interface TopImagesWidgetProps {
	data: ImageType[];
	onDelete?: (imageId: string) => void;
}

export function TopImagesWidget({data}: TopImagesWidgetProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

	return (
		<View style={styles.container}>
			<Text style={styles.headerTitle}>Featured Gallery</Text>
			<View style={styles.galleryGrid}>
				{data.slice(0, 6).map((item, index) => (
					<View key={item.id} style={styles.gridItemWrapper}>
						<PhotoGridItem image={item} isMine={false} onSelect={() => setSelectedIndex(index)} />
					</View>
				))}
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
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 24,
		marginBottom: 12,
	},
	headerTitle: {
		color: '#ffffff',
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 14,
		letterSpacing: 0.3,
	},
	galleryGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
	},
	gridItemWrapper: {
		width: '48.2%', // Two equal columns with gap calculation
		aspectRatio: 1.1, // Gives images a larger, open visual frame
		borderRadius: 12,
		overflow: 'hidden',
	},
});
