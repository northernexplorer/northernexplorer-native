import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Redirect} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Spinner} from '@northernexplorer/tools-web';
import {RolesEnum} from '@northernexplorer/types';
import {useApiFetch} from '~/core/useApiFetch';
import {useApiMutation} from '~/core/useApiMutation';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {PhotoGridItem} from '~/location/PointOfInterestDetails/components/PhotoGridItem';
import {PhotoPreviewModal} from '~/location/PointOfInterestDetails/components/PhotoPreviewModal';

export function PendingImages() {
	const authentication = useAuthentication();
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
	const [approvingImageId, setApprovingImageId] = useState<string | null>(null);

	const {data: images, loading, refetch} = useApiFetch('location', 'ImageController', 'getPendingImages', {});
	const {mutate: approveMutation} = useApiMutation('location', 'ImageController', 'approveImage');
	const {mutate: rejectMutation} = useApiMutation('location', 'ImageController', 'rejectImage');

	if (!authentication) return <Redirect href="/profile/login" />;
	if (!authentication.roles?.includes(RolesEnum.Admin)) return <Redirect href="404" />;
	if (loading) return <Spinner />;

	if (!images || images.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Ionicons name="images-outline" size={48} color="#adb5bd" />
				<Text style={styles.emptyText}>No pending images awaiting moderation.</Text>
			</View>
		);
	}

	const currentUserId = authentication.userId;
	const isAdmin = authentication.roles.includes(RolesEnum.Admin);
	const selectedImage = selectedImageIndex !== null ? images[selectedImageIndex] : null;

	const handleNextOrCloseIndex = () => {
		if (selectedImageIndex !== null) {
			if (images.length <= 1) {
				setSelectedImageIndex(null);
			} else if (selectedImageIndex >= images.length - 1) {
				setSelectedImageIndex(images.length - 2);
			}
		}
	};

	const handleApproveImage = async (imageId: string) => {
		setApprovingImageId(imageId);
		try {
			await approveMutation({id: imageId});
			await refetch();
			handleNextOrCloseIndex();
		} finally {
			setApprovingImageId(null);
		}
	};

	const handleRejectImage = async (imageId: string) => {
		setDeletingImageId(imageId);
		try {
			await rejectMutation({id: imageId});
			await refetch();
			handleNextOrCloseIndex();
		} finally {
			setDeletingImageId(null);
		}
	};

	return (
		<View style={styles.grid}>
			{images.map((image, index) => (
				<PhotoGridItem key={image.id} image={image} isMine={image.user.id === currentUserId} onSelect={() => setSelectedImageIndex(index)} />
			))}

			{selectedImage && selectedImageIndex !== null && (
				<PhotoPreviewModal
					selectedImageId={selectedImage.id}
					selectedIndex={selectedImageIndex}
					totalImages={images.length}
					currentUserId={currentUserId}
					isAdmin={isAdmin}
					deletingImageId={deletingImageId}
					approvingImageId={approvingImageId}
					onClose={() => setSelectedImageIndex(null)}
					onPrevious={() => setSelectedImageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
					onNext={() => setSelectedImageIndex(prev => (prev !== null && prev < images.length - 1 ? prev + 1 : prev))}
					onDelete={handleRejectImage}
					onApprove={handleApproveImage}
					onReject={handleRejectImage}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
		paddingBottom: 24,
	},
	emptyContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 48,
		gap: 12,
	},
	emptyText: {
		fontSize: 14,
		color: '#6c757d',
		textAlign: 'center',
	},
});
