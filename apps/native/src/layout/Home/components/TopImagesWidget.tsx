import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {ImageType} from '@northernexplorer/types';
import {PhotoGridItem} from '~/location/PointOfInterestDetails/components/PhotoGridItem';
import {PhotoPreviewModal} from '~/location/PointOfInterestDetails/components/PhotoPreviewModal';

interface TopImagesWidgetProps {
	data: ImageType[];
	currentUserId?: string;
	onDelete?: (imageId: string) => void;
}

export function TopImagesWidget({data, currentUserId}: TopImagesWidgetProps) {
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
			<Text style={styles.headerTitle}>Top Photos</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
				{data.map((item, index) => (
					<View key={item.id} style={styles.itemWrapper}>
						<PhotoGridItem
							image={item}
							isMine={Boolean(currentUserId && item.user.id === currentUserId)}
							onSelect={() => setSelectedIndex(index)}
						/>
					</View>
				))}
			</ScrollView>

			{selectedImage && selectedIndex !== null && (
				<PhotoPreviewModal
					selectedImageId={selectedImage.id}
					selectedIndex={selectedIndex}
					totalImages={data.length}
					currentUserId={currentUserId}
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
		marginTop: 20,
	},
	headerTitle: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 12,
	},
	scrollContent: {
		gap: 12,
	},
	itemWrapper: {
		width: 140, // Fixed width container for horizontal scroll item sizing
	},
});
