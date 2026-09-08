import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {PointOfInterestType, RolesEnum} from '@northernexplorer/types';
import {Link} from 'expo-router';
import {PhotoUploadCard} from './PhotoUploadCard';
import {PhotoGridItem} from './PhotoGridItem';
import {PhotoPreviewModal} from './PhotoPreviewModal';
import {useApiMutation} from '~/core/useApiMutation';
import {styles as globalStyles} from '~/location/PointOfInterestDetails/styles';
import {useAuthentication} from '~/user/state/authentication/useAuthentication';
import {alertStore} from '~/core/alertStore';

type PhotosProps = {
	data: PointOfInterestType;
	refetch: () => void;
};

export function Photos({data, refetch}: PhotosProps) {
	const authentication = useAuthentication();
	const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
	const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

	const {mutate: deleteMutation} = useApiMutation('location', 'ImageController', 'deleteById');
	const {mutate: uploadMutation} = useApiMutation('location', 'ImageController', 'upload');
	const {mutate: likeMutation} = useApiMutation('location', 'ImageController', 'like');
	const {mutate: unlikeMutation} = useApiMutation('location', 'ImageController', 'unLike');

	const images = data.images || [];
	const isAdmin = authentication?.roles?.includes(RolesEnum.Admin);

	const selectedIndex = selectedImageId !== null ? images.findIndex(img => img.id === selectedImageId) : -1;
	const selectedImage = selectedIndex !== -1 ? images[selectedIndex] : null;

	const handleDelete = (imageId: string) => {
		alertStore.showAlert({
			title: 'Delete Photo',
			message: 'Are you sure you want to delete this photo? This action cannot be undone.',
			type: 'warning',
			buttons: [
				{text: 'Cancel', style: 'cancel'},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						setDeletingImageId(imageId);
						await deleteMutation({id: imageId});
						if (selectedImageId === imageId) {
							setSelectedImageId(null);
						}
						refetch();
						setDeletingImageId(null);
					},
				},
			],
		});
	};

	const handleLike = async (imageId: string) => {
		await likeMutation({id: imageId});
		refetch();
	};

	const handleUnlike = async (imageId: string) => {
		await unlikeMutation({id: imageId});
		refetch();
	};

	const handlePreviousImage = () => {
		if (selectedIndex > 0) {
			setSelectedImageId(images[selectedIndex - 1].id);
		}
	};

	const handleNextImage = () => {
		if (selectedIndex !== -1 && selectedIndex < images.length - 1) {
			setSelectedImageId(images[selectedIndex + 1].id);
		}
	};

	return (
		<View style={styles.container}>
			{!authentication ? (
				<Link href="profile/login" asChild>
					<Pressable style={styles.loggedOutCard}>
						<Ionicons name="images-outline" size={24} color="#64748b" />
						<Text style={styles.loggedOutText}>Log in to share photos</Text>
					</Pressable>
				</Link>
			) : (
				<PhotoUploadCard pointOfInterestId={data.id} uploadMutation={uploadMutation} refetch={refetch} />
			)}

			{/* Header */}
			<View style={styles.headerSection}>
				<Text style={globalStyles.reviewTitle}>Community Photos ({images.length})</Text>
			</View>

			{/* Empty State */}
			{images.length === 0 ? (
				<View style={styles.emptyState}>
					<Ionicons name="images-outline" size={44} color="#cbd5e1" />
					<Text style={styles.emptyTitle}>No photos yet</Text>
					<Text style={styles.emptySubtitle}>Be the first to share photos of this location with the community.</Text>
				</View>
			) : (
				/* Photo Grid */
				<View style={styles.gridContainer}>
					{images.map(image => {
						const isMine = image.user.id === authentication?.userId;
						const canManage = Boolean(isAdmin || isMine);

						return (
							<PhotoGridItem
								key={image.id}
								image={image}
								isMine={isMine}
								canManage={canManage}
								onSelect={() => setSelectedImageId(image.id)}
								onDelete={handleDelete}
							/>
						);
					})}
				</View>
			)}

			{/* Fullscreen Photo Modal Preview */}
			<PhotoPreviewModal
				visible={selectedImage !== null}
				selectedImage={selectedImage}
				selectedIndex={selectedIndex !== -1 ? selectedIndex : null}
				totalImages={images.length}
				currentUserId={authentication?.userId}
				isAdmin={isAdmin}
				deletingImageId={deletingImageId}
				onClose={() => setSelectedImageId(null)}
				onPrevious={handlePreviousImage}
				onNext={handleNextImage}
				onLike={handleLike}
				onUnlike={handleUnlike}
				onDelete={handleDelete}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
	loggedOutCard: {
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderStyle: 'dashed',
		padding: 18,
		marginVertical: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
	},
	loggedOutText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#64748b',
	},
	headerSection: {
		marginTop: 8,
		marginBottom: 12,
	},
	gridContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 32,
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderStyle: 'dashed',
		marginVertical: 8,
	},
	emptyTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#0f172a',
		marginTop: 10,
	},
	emptySubtitle: {
		fontSize: 13,
		color: '#64748b',
		textAlign: 'center',
		marginTop: 4,
		maxWidth: 280,
	},
});
